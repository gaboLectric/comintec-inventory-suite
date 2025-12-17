import * as XLSX from 'xlsx';
import pb from './pocketbase';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let workbook;
        if (isCsv) {
          const text = e.target.result;
          workbook = XLSX.read(text, { type: 'string' });
        } else {
          const data = new Uint8Array(e.target.result);
          workbook = XLSX.read(data, { type: 'array' });
        }
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Normalize keys to lowercase and replace spaces with underscores to support various header formats
        const normalizedData = jsonData.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            // Replace spaces with underscores, remove special chars except alphanumeric and underscore/hyphen/slash
            const normalizedKey = key.toLowerCase().trim()
              .replace(/\s+/g, '_')
              .replace(/[^\w\-\/]/g, ''); // Remove dots, parenthesis, etc to make matching easier
            newRow[normalizedKey] = row[key];
          });
          return newRow;
        });

        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    
    if (isCsv) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

const ALIASES = {
  equipments: {
    numero_serie: ['numero_serie', 'num_serie', 'no_serie', 'n_serie', 'serie', 'serial', 'sn', 's_n', 'numero_de_serie', 'no_serie', 'n_serie', 's/n', 'num_de_serie'],
    producto: ['producto', 'nombre', 'descripcion', 'equipo', 'item', 'desc'],
    codigo: ['codigo', 'clave', 'sku', 'id', 'code'],
    marca: ['marca', 'brand', 'fabricante'],
    modelo: ['modelo', 'model'],
    pedimento: ['pedimento', 'ped'],
    observaciones: ['observaciones', 'notas', 'comentarios', 'detalles', 'obs']
  },
  supplies: {
    nombre: ['nombre', 'producto', 'descripcion', 'insumo', 'item'],
    piezas: ['piezas', 'cantidad', 'stock', 'existencia', 'qty', 'cant'],
    stock_deseado: ['stock_deseado', 'stock_minimo', 'minimo', 'ideal', 'target']
  }
};

const findValue = (row, field, type) => {
  // 1. Try exact match
  if (row[field] !== undefined) return row[field];
  
  // 2. Try aliases
  const aliases = ALIASES[type]?.[field] || [];
  for (const alias of aliases) {
    if (row[alias] !== undefined) return row[alias];
  }
  
  return undefined;
};

export const validateSupplyData = (rows) => {
  const valid = [];
  const invalid = [];

  rows.forEach((row, index) => {
    const errors = [];
    const rowNum = index + 2; // Excel row number (1-based, header is 1)
    
    // Map aliases to canonical fields
    const processedRow = { ...row };
    ['nombre', 'piezas', 'stock_deseado'].forEach(field => {
      const val = findValue(row, field, 'supplies');
      if (val !== undefined) processedRow[field] = val;
    });

    if (!processedRow.nombre || String(processedRow.nombre).trim() === '') {
      errors.push('Nombre es requerido');
    }
    if (processedRow.piezas === undefined || processedRow.piezas === null || isNaN(Number(processedRow.piezas)) || Number(processedRow.piezas) < 0) {
      errors.push('Piezas debe ser un número mayor o igual a 0');
    }
    if (processedRow.stock_deseado === undefined || processedRow.stock_deseado === null || isNaN(Number(processedRow.stock_deseado)) || Number(processedRow.stock_deseado) < 0) {
      errors.push('Stock deseado debe ser un número mayor o igual a 0');
    }

    if (errors.length > 0) {
      invalid.push({ row: rowNum, data: processedRow, errors });
    } else {
      valid.push({ ...processedRow, piezas: Number(processedRow.piezas), stock_deseado: Number(processedRow.stock_deseado) });
    }
  });

  return { valid, invalid };
};

const toSentenceCase = (str) => {
  if (!str) return '';
  // Convert to lowercase first
  const lower = str.toLowerCase();
  // Capitalize first letter of string and any letter following a period/exclamation/question mark
  return lower.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
};

export const validateEquipmentData = (rows) => {
  const valid = [];
  const invalid = [];
  // Removed seenSerials check to allow all data to pass to import stage

  rows.forEach((row) => {
    // Fill empty fields with "Sin datos"
    const processedRow = { ...row };
    ['codigo', 'producto', 'marca', 'modelo', 'numero_serie', 'pedimento', 'observaciones'].forEach(field => {
      // Find value using aliases
      let rawValue = findValue(row, field, 'equipments');
      
      // Trim whitespace and check if empty
      let value = rawValue ? String(rawValue).trim() : '';
      
      // Check for common placeholders
      const placeholders = [
        'n/a', 'na', 'no aplica', 'no tiene', 'sin serie', 's/n', 'sn', 
        '-', '--', '.', '?', '0', 'tbd', 'pending', 'pendiente', 
        'null', 'undefined', 'vacio', 'none', 'sin datos'
      ];
      
      if (placeholders.includes(value.toLowerCase())) {
        value = ''; 
      }
      
      if (value === '') {
        processedRow[field] = 'Sin datos';
      } else {
        processedRow[field] = value;
      }
    });

    // Normalize observaciones to Sentence case
    if (processedRow.observaciones && processedRow.observaciones !== 'Sin datos') {
      processedRow.observaciones = toSentenceCase(processedRow.observaciones);
    }

    // Removed duplicate serial check
    // Removed required field checks (they are filled with "Sin datos" now)
    // Removed length limit on observations

    // All rows are considered valid for attempt
    valid.push(processedRow);
  });

  return { valid, invalid };
};

export const importSupplies = async (validatedData) => {
  const promises = validatedData.map(async (item) => {
    try {
      const record = await pb.collection('supplies').create(item);
      return { success: true, data: record };
    } catch (error) {
      return { success: false, item, error: error.message };
    }
  });

  const results = await Promise.all(promises);

  const success = results.filter(r => r.success).map(r => r.data);
  const errors = results.filter(r => !r.success).map(r => ({ item: r.item, error: r.error }));

  return { success, errors };
};

export const importEquipments = async (validatedData) => {
  const promises = validatedData.map(async (item, index) => {
    const dataToSave = { ...item };
    
    try {
      // If serial is "Sin datos", append a unique suffix to avoid DB unique constraint violation
      if (dataToSave.numero_serie.startsWith('Sin datos')) {
        // Use timestamp and random string to ensure uniqueness across imports
        const uniqueSuffix = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100000)}`;
        dataToSave.numero_serie = `Sin datos ${uniqueSuffix}`;
      }

      const record = await pb.collection('equipments').create(dataToSave);
      return { success: true, data: record };
    } catch (error) {
      // If error is unique constraint on numero_serie, try to append suffix and retry
      // This fulfills "import everything" requirement even if duplicates exist
      if (error.status === 400 && error.response?.data?.numero_serie) {
         try {
            const uniqueSuffix = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100000)}`;
            const newData = { ...item, numero_serie: `${item.numero_serie}_DUP_${uniqueSuffix}` };
            const record = await pb.collection('equipments').create(newData);
            return { success: true, data: record };
         } catch (retryError) {
            return { success: false, item, error: retryError.message };
         }
      }
      return { success: false, item, error: error.message };
    }
  });

  const results = await Promise.all(promises);

  const success = results.filter(r => r.success).map(r => r.data);
  const errors = results.filter(r => !r.success).map(r => ({ item: r.item, error: r.error }));

  return { success, errors };
};

export const generateTemplate = (type) => {
  let data = [];
  let filename = '';

  if (type === 'supplies') {
    data = [
      { nombre: 'Tornillo M5', piezas: 100, stock_deseado: 50 },
      { nombre: 'Cable UTP Cat6', piezas: 200, stock_deseado: 100 }
    ];
    filename = 'plantilla_insumos.xlsx';
  } else if (type === 'equipments') {
    data = [
      { 
        codigo: 'EQ001', 
        producto: 'Laptop Dell', 
        marca: 'Dell', 
        modelo: 'Latitude 5420', 
        numero_serie: 'SN123456', 
        pedimento: 'PED-2024-001', 
        observaciones: 'Equipo nuevo' 
      },
      { 
        codigo: 'EQ002', 
        producto: 'Monitor LG', 
        marca: 'LG', 
        modelo: '24MK430H', 
        numero_serie: 'SN789012', 
        pedimento: 'PED-2024-002', 
        observaciones: 'Monitor 24"' 
      }
    ];
    filename = 'plantilla_equipos.xlsx';
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
  XLSX.writeFile(workbook, filename);
};
