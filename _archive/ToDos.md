## Infraestructura y Tooling

- **Migración a Bun:** Se utilizará Bun como runtime y gestor de paquetes para el proyecto, reemplazando a Node.js/npm donde aplique.

## Modifiaciones a la app de inventario:

Habra 2 vistas: Equipos e Insumos, son 2 areas diferentes en la app

- Eliminamos el campo de categoria de todos lados, todas las tablas

1. Estructura de Base de Datos
Equipos e Insumos deben ser:
    Dos colecciones separadas (equipments y supplies)

Dos colecciones separadas porque:

        Los campos son completamente diferentes
        Facilita validaciones específicas
        Mejor separación de responsabilidades
        Más claro para futuras expansiones

Productos pasa a ser Almacen, ya no se llamara Productos. Se despliegan 2 opciones dentro de Almacen que son: Equipos e Insumos

Ejemplo:              
- Dashboard
- Almacén
  - Equipos
  - Insumos
- Salidas
- Usuarios

## No hay migracion de datos, todo se borra y empieza de 0

## Equipos:

- LLevan los campos de los apartados de Codigo, Producto, Marca, Modelo, Numero de Serie, Pedimento y Observaciones. No hay campo de unidades en este caso porque cada producto lleva un numero de serie diferente y demas, por qeso es mas simple

    Los codigos se ingresan manualmente, puede haber repetidos, el pedimento es un string, las observaciones deberan ser de unos 100 caracteres como maximo, numero de serie es unico e irrepetible, no debe permitir repetirlo la app. Los campos que si se pueden repetir son Codigo, Pedimento, Observaciones claramente.

    Se conserva media_id para que los productos tengan una imagen que se pueda expandir al dar click al visualizar el producto, que se abra en un modal.

- Van en apartado de Equipos, debera renombrarse la palabra "Productos"  en Front, backend y bd como equipos, en pocketbase seria equipments

    Los insumos no llevan media_id, no necesitan imagen


## Insumos:

- Solo llevan campos del Nombre del producto y Piezas (Unidades)
- Van en apartado y tabla de Insumos

PRECIOS de compra y venta se deben de borrar, ni en front, ni backend existiran.

TODOS los apartados de ventas de estadisticos se deben de borrar u al menos esconder

* Ambos Equipos e Insumos conservan campo de fecha de agregado *

Para insumos, llevara apartado de stock deseado para mandar una notificacion sencilla cada vez que se ingresa a la app y un indicador si las piezas registradas son menores que las del stock deseado.

Apartado de Ventas no sera llamado ventas, sera Salidas, sera la manera de restarle al apartado de Insumos o de Productos y que quede registro de esas salidas por 2 semanas.

Relación entre Salidas y los Nuevos Tipos
La tabla sales (ahora salidas) tiene una relación con productos:

Escenario Equipos:

Cada equipo tiene un número de serie único
¿Una "Salida" de equipo significa que sale del inventario permanentemente?
Si, es correcto.

Escenario Insumos:

Los insumos tienen cantidad (piezas)
¿Las salidas restan de la cantidad disponible?
Es correcto, en la tabla de supplies.
¿Se permite salida parcial?
NO.
¿Las Salidas pueden referenciar tanto Equipos como Insumos, o solo uno de ellos?
Ambos, pero lo conveniente serian salidas separadas, para evitar confusiones. En pantallas separadas, en un selector para Equipos y otro para insumos

Las salidas en el caso de equipos deben tener un buscador o filtros para encontrar el equipo que se dara salida, asegurando que coincida el numero de serie y codigo, marca, modelo, etc

Salidas de Insumos deberian descontar del stock de insumos, tambien debemos poder filtrar o buscar para hacer mas eficazes las salidas.


Tabla de Salidas - Campos Adicionales 
La tabla actual de ventas tiene qty y price. En Salidas:

¿Se mantiene qty (cantidad)?
NO
¿Se elimina price completamente?
Si
¿Se agregan campos adicionales como "motivo de salida", "destino", "responsable"?
Un campo de nota de salida para strings.
¿Qué información adicional necesitas registrar en cada Salida?
La fecha de salida tal y como esta en la fecha de entrada.


## Dashboard - Nuevas Estadísticas
Si se eliminan estadísticas de ventas, ¿qué se muestra en su lugar?

- Total de Equipos en inventario
- Total de Insumos en inventario
- Insumos con bajo stock

## Permisos de Usuario:

Pregunta: ¿Los niveles de usuario actuales (Admin=1, Special=2, User=3) se mantienen igual para Equipos, Insumos y Salidas?

Si, enfocandonos en que quiero un usuario (Admin o Special) que pueden operar todo el inventario y verlo todo, y usuarios simples solamente podran consultar inventario de Equipos, insumos no son visibles para ellos.

## Ambigüedades Resueltas y Definiciones Técnicas

1. **Colecciones para Salidas:**
   - Se usarán dos colecciones separadas: `equipment_outputs` y `supply_outputs`.
   - `equipment_outputs`: `equipment_id` (relation), `nota`, `fecha`.
   - `supply_outputs`: `supply_id` (relation), `nota`, `fecha`.
   - Esto facilita las pantallas y filtros separados solicitados.

2. **Comportamiento Salida Equipos:**
   - Al registrar una salida, el equipo se **borrará** de la colección `equipments` y se creará el registro en `equipment_outputs` como historial.

3. **Registro de Salidas por 2 semanas:**
   - Se mantendrán los datos en base de datos.
   - La restricción de "2 semanas" se aplicará solo a nivel de **UI/Visualización** (filtrar para mostrar solo las últimas 2 semanas).

4. **Stock Deseado + Notificaciones Insumos:**
   - Se agregará el campo `stock_deseado` (number) en la colección `supplies`.
   - **Notificación:** Se mostrará un Toast/Alerta en el Dashboard/Insumos si el stock actual < stock deseado.
   - **Indicador:** Se resaltará en la tabla (color rojo/amarillo) los insumos con bajo stock.

5. **Permisos de Usuario (Nivel 3):**
   - **Solo Lectura de Equipos:** Los usuarios de nivel 3 solo pueden **consultar/ver** la lista de Equipos.
   - **Sin acceso a Insumos:** No pueden ver ni acceder al apartado de Insumos.
   - **Sin creación de Salidas:** No pueden registrar salidas ni de Equipos ni de Insumos.
   - **Dashboard:** Verán el dashboard pero sin estadísticas relacionadas con Insumos.