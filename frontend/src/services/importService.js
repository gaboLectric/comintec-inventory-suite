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
        
        console.log(`Excel parsed: ${jsonData.length} rows found`);
        console.log('Headers detected:', Object.keys(jsonData[0] || {}));
        
        // Normalize keys to lowercase and replace spaces with underscores to support various header formats
        const normalizedData = jsonData.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            // More conservative normalization - keep more characters
            const normalizedKey = key.toLowerCase().trim()
              .replace(/\s+/g, '_'); // Only replace spaces with underscores
            newRow[normalizedKey] = row[key];
          });
          return newRow;
        });

        resolve(normalizedData);
      } catch (error) {
        console.error('Excel parsing error:', error);
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
    observaciones: ['observaciones', 'notas', 'comentarios', 'detalles', 'obs'],
    vendido: ['vendido', 'sold', 'status', 'venta', 'estatus', 'is_sold']
  },
  supplies: {
    nombre: ['nombre', 'producto', 'descripcion', 'insumo', 'item', 'articulo', 'material'],
    piezas: ['piezas', 'cantidad', 'stock', 'existencia', 'qty', 'cant', 'unidades', 'inventario'],
    stock_deseado: ['stock_deseado', 'stock_minimo', 'minimo', 'ideal', 'target', 'objetivo', 'meta']
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
  
  // 3. Try case-insensitive search for common patterns
  const keys = Object.keys(row);
  
  if (field === 'nombre' && type === 'supplies') {
    // Look for any key that might contain product info
    const productKey = keys.find(key => 
      key.includes('producto') || 
      key.includes('nombre') || 
      key.includes('item') ||
      key.includes('articulo') ||
      key.includes('material')
    );
    if (productKey && row[productKey] !== undefined) return row[productKey];
  }
  
  if (field === 'piezas' && type === 'supplies') {
    // Look for any key that might contain quantity info
    const quantityKey = keys.find(key => 
      key.includes('pieza') || 
      key.includes('cantidad') || 
      key.includes('stock') ||
      key.includes('existencia') ||
      key.includes('qty') ||
      key.includes('cant') ||
      key.includes('unidad')
    );
    if (quantityKey && row[quantityKey] !== undefined) return row[quantityKey];
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

    // Validate nombre (required)
    if (!processedRow.nombre || String(processedRow.nombre).trim() === '') {
      errors.push('Nombre/Producto es requerido');
    } else {
      processedRow.nombre = String(processedRow.nombre).trim();
    }

    // Validate piezas (required)
    if (processedRow.piezas === undefined || processedRow.piezas === null || 
        String(processedRow.piezas).trim() === '' || 
        isNaN(Number(processedRow.piezas)) || 
        Number(processedRow.piezas) < 0) {
      errors.push('Piezas debe ser un número mayor o igual a 0');
    } else {
      processedRow.piezas = Number(processedRow.piezas);
    }

    // Handle stock_deseado (optional - use piezas as default if not provided)
    if (processedRow.stock_deseado === undefined || 
        processedRow.stock_deseado === null || 
        String(processedRow.stock_deseado).trim() === '') {
      // If stock_deseado is not provided, use piezas as default
      processedRow.stock_deseado = processedRow.piezas || 0;
    } else if (isNaN(Number(processedRow.stock_deseado)) || Number(processedRow.stock_deseado) < 0) {
      errors.push('Stock deseado debe ser un número mayor or igual a 0');
    } else {
      processedRow.stock_deseado = Number(processedRow.stock_deseado);
    }

    if (errors.length > 0) {
      invalid.push({ row: rowNum, data: processedRow, errors });
    } else {
      valid.push({
        nombre: processedRow.nombre,
        piezas: processedRow.piezas,
        stock_deseado: processedRow.stock_deseado
      });
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
    // Create a clean object with only allowed fields
    const processedRow = {};
    
    // Text fields
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

    // Truncate observaciones to 100 chars (DB limit)
    if (processedRow.observaciones && processedRow.observaciones.length > 100) {
      processedRow.observaciones = processedRow.observaciones.substring(0, 100);
    }

    // Normalize observaciones to Sentence case
    if (processedRow.observaciones && processedRow.observaciones !== 'Sin datos') {
      processedRow.observaciones = toSentenceCase(processedRow.observaciones);
    }

    // Handle vendido (boolean)
    const vendidoRaw = findValue(row, 'vendido', 'equipments');
    if (vendidoRaw !== undefined && vendidoRaw !== null && String(vendidoRaw).trim() !== '') {
      const v = String(vendidoRaw).trim().toUpperCase();
      processedRow.vendido = ['SÍ', 'SI', 'YES', 'TRUE', '1', 'VENDIDO'].includes(v);
    }
    // Removed else block to avoid sending 'vendido' field if it's not present in the source
    // This prevents errors if the 'vendido' field doesn't exist in the database schema yet

    // All rows are considered valid for attempt
    valid.push(processedRow);
  });

  return { valid, invalid };
};

export const importSupplies = async (validatedData) => {
  console.log(`Starting import of ${validatedData.length} supplies`);
  
  const promises = validatedData.map(async (item, index) => {
    try {
      console.log(`Creating supply ${index + 1}:`, item);
      
      // Check if supply with same name already exists
      try {
        const existing = await pb.collection('supplies').getFirstListItem(`nombre = "${item.nombre}"`);
        if (existing) {
          console.log(`Supply "${item.nombre}" already exists, skipping`);
          return { success: false, item, error: `Ya existe un insumo con el nombre "${item.nombre}"` };
        }
      } catch (existsError) {
        // If error is "not found", that's good - means no duplicate
        if (existsError.status !== 404) {
          console.error('Error checking for duplicates:', existsError);
        }
      }
      
      const record = await pb.collection('supplies').create(item);
      console.log(`Successfully created supply:`, record.nombre);
      return { success: true, data: record };
    } catch (error) {
      console.error(`Failed to create supply "${item.nombre}":`, error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Extract more specific error information
      let errorMessage = error.message;
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // Handle field-specific errors
          const fieldErrors = [];
          Object.keys(errorData).forEach(field => {
            if (errorData[field] && errorData[field].message) {
              fieldErrors.push(`${field}: ${errorData[field].message}`);
            } else if (errorData[field]) {
              fieldErrors.push(`${field}: ${errorData[field]}`);
            }
          });
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join(', ');
          }
        }
      }
      
      return { success: false, item, error: errorMessage };
    }
  });

  const results = await Promise.all(promises);

  const success = results.filter(r => r.success).map(r => r.data);
  const errors = results.filter(r => !r.success).map(r => ({ item: r.item, error: r.error }));

  console.log(`Import completed: ${success.length} successful, ${errors.length} failed`);
  if (errors.length > 0) {
    console.log('Failed items:', errors);
  }

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
      console.error('Import error for item:', JSON.stringify(item, null, 2));
      console.error('Error details:', JSON.stringify(error.response || error.message, null, 2));
      
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
      { PRODUCTO: 'Sacapuntas', PIEZAS: 57 },
      { PRODUCTO: 'Lápiz HB', PIEZAS: 120 },
      { PRODUCTO: 'Borrador', PIEZAS: 85 }
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

export const exportData = async (type) => {
  try {
    const records = await pb.collection(type).getFullList();

    let data = [];
    let filename = '';

    if (type === 'supplies') {
      data = records.map(r => ({
        nombre: r.nombre,
        piezas: r.piezas,
        stock_deseado: r.stock_deseado
      }));
      filename = `inventario_insumos_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else if (type === 'equipments') {
      data = records.map(r => ({
        codigo: r.codigo,
        producto: r.producto,
        marca: r.marca,
        modelo: r.modelo,
        numero_serie: r.numero_serie,
        pedimento: r.pedimento,
        observaciones: r.observaciones,
        vendido: r.vendido ? 'SÍ' : 'NO'
      }));
      filename = `inventario_equipos_${new Date().toISOString().split('T')[0]}.xlsx`;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};
