const mysql = require('mysql2/promise');

// Configuración de la base de datos (se recomienda usar Variables de Entorno)
const dbConfig = {
    // cambiar el host
    host: process.env.DB_HOST || 'database-3.civekaicinjj.us-east-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'databaseLambda',
    connectTimeout: 10000 // 10 segundos de espera máximo
};

// Crear el pool de conexiones fuera del handler para reutilizarlo
let pool;
// cloud computing!!!!
exports.handler = async (event) => {
    if (!pool) pool = mysql.createPool(dbConfig);
    
    const { routeKey, pathParameters, body } = event;
    const id = pathParameters ? pathParameters.id : null;
    const data = body ? JSON.parse(body) : {};

    try {
        let result;
        switch (routeKey) {
            case "GET /users":
                [result] = await pool.query("SELECT * FROM users");
                break;
                
            case "POST /add":
                [result] = await pool.query("INSERT INTO users SET ?", data);
                break;
                
            case "PUT /update/{id}":
                [result] = await pool.query("UPDATE users SET ? WHERE id = ?", [data, id]);
                break;
                
            case "DELETE /delete/{id}":
                [result] = await pool.query("DELETE FROM users WHERE id = ?", id);
                break;
                
            default:
                throw new Error(`Ruta no soportada: ${routeKey}`);
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(result)
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};


// exports.handler = async (event) => {
//     if (!pool) {
//         pool = mysql.createPool(dbConfig);
//     }

//     try {
//         // 1. Crear la tabla si no existe
//         const createTableQuery = `
//             CREATE TABLE IF NOT EXISTS users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 name VARCHAR(100) NOT NULL,
//                 tel VARCHAR(20),
//                 email VARCHAR(100) UNIQUE,
//                 address TEXT
//             );
//         `;
//         await pool.query(createTableQuery);

//         // 2. Datos aleatorios para insertar
//         const randomUsers = [
//             ['Juan Perez', '3001234567', 'juan@example.com', 'Calle 10 #20-30'],
//             ['Maria Lopez', '3109876543', 'maria@test.com', 'Av. Siempre Viva 123'],
//             ['Carlos Ruiz', '3204445566', 'cruiz@db.com', 'Carrera 5 #12-45'],
//             ['Ana Garcia', '3157778899', 'ana.g@web.com', 'Transversal 88 #9-10'],
//             ['Luis Castro', '3005550011', 'lcastro@server.com', 'Pasaje 4 #1-2']
//         ];

//         // 3. Insertar datos (usamos IGNORE para evitar errores si los emails ya existen)
//         const insertQuery = `
//             INSERT IGNORE INTO users (name, tel, email, address) 
//             VALUES ?
//         `;
        
//         const [insertResult] = await pool.query(insertQuery, [randomUsers]);

//         // 4. Consultar los datos para confirmar
//         const [rows] = await pool.query('SELECT * FROM users');
        
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: "Operación completada",
//                 filasInsertadas: insertResult.affectedRows,
//                 usuariosActuales: rows
//             }),
//         };
//     } catch (error) {
//         console.error("Error en la operación:", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ 
//                 error: "Error en el servidor", 
//                 message: error.message 
//             }),
//         };
//     }
// };


// Ve a IAM > Users.
// Selecciona tu usuario github-actions.
// En la pestaña Permissions, haz clic en Add permissions > Add inline policy.
// Haz clic en la pestaña JSON y pega este código (borra lo que haya ahí):
// JSON
// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Effect": "Allow",
//             "Action": [
//                 "lambda:UpdateFunctionCode"
//             ],
//             "Resource": "arn:aws:lambda:us-east-1:xxxxxxxxxxxx:function:NOMBREDETULAMBDA"
//         }
//     ]
// }

// 1. eliminar base de datos 
// 2. Lambda -> Quitar la VPC asociada a la funcion Lambda
// 3. VPC -> quitar la puerta de enlace y luego eliminar
// 4. Grupos de seguridad -> editar la reglas de entra y salida y quitar la reglas
// luego eliminar los grupos de seguridad
// 5. EC2 -> eliminar las interfaces de red
// 6. VPC -> eliminar las subredes
// 7. VPC -> Eliminar la VPC


