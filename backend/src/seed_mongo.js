const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.DATABASE_URL;

const JSON_FILE_PATH = path.join(__dirname, '../scrapping/data', 'catalogo_full.json');

const CATEGORY_MAP = {
    'NOTEBOOKS': 'NOTEBOOKS',
    'COMPUTADORAS': 'COMPUTADORAS',
    'MONITORES': 'MONITORES',
    'IMPRESORAS': 'IMPRESORAS',
    'DEFAULT': 'OTROS'
};

async function main() {
    console.log('🚀 [SEED] Iniciando sincronización con MongoDB...');

    if (!fs.existsSync(JSON_FILE_PATH)) {
        console.error(`❌ Error: No se encuentra el archivo en ${JSON_FILE_PATH}`);
        console.error("   Ejecuta primero el scraper: python scrapping.py");
        process.exit(1);
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log("✅ Conexión establecida con MongoDB Atlas");

        const db = client.db();
        const collection = db.collection('products');

        const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
        const catalogo = JSON.parse(rawData);

        console.log(`📦 Procesando ${catalogo.length} productos del archivo JSON...`);

        const operaciones = catalogo.map(p => {
            const catEnum = CATEGORY_MAP[p.categoria] || CATEGORY_MAP['DEFAULT'];
            const attrs = p.atributos || {};
            const specsClean = {};

            // PC / Notebooks
            if (attrs.cpu) specsClean.cpu = attrs.cpu;
            if (attrs.ram) specsClean.ram = attrs.ram;
            if (attrs.almacenamiento) specsClean.storage = attrs.almacenamiento;
            if (attrs.gpu) specsClean.gpu = attrs.gpu;
            if (attrs.so) specsClean.os = attrs.so;

            // Monitores
            if (attrs.pulgadas) specsClean.screenSize = attrs.pulgadas;
            if (attrs.resolucion) specsClean.resolution = attrs.resolucion;
            if (attrs.tasa_refresco) specsClean.refreshRate = attrs.tasa_refresco;
            if (attrs.tipo_panel) specsClean.panelType = attrs.tipo_panel;

            // Impresoras
            if (attrs.tipo) specsClean.printType = attrs.tipo;
            if (attrs.velocidad) specsClean.printSpeed = attrs.velocidad;
            if (attrs.conectividad) specsClean.connectivity = attrs.conectividad;
            if (attrs.formato_maximo) specsClean.maxPrintSize = attrs.formato_maximo;
            if (attrs.sistema_continuo) specsClean.continuousSystem = attrs.sistema_continuo;

            return {
                updateOne: {
                    filter: { sku: p.sku },
                    update: {
                        $set: {
                            sku: p.sku,
                            name: p.nombre,
                            brand: p.marca || "Genérico",
                            category: catEnum,
                            priceUsd: p.precio_usd,
                            inStock: p.stock,
                            imageUrl: p.img,
                            gallery: p.galeria || [],
                            specs: specsClean,
                            lastScraped: new Date(),
                            updatedAt: new Date(),
                            isActive: true
                        },
                        $setOnInsert: { 
                            createdAt: new Date() 
                        }
                    },
                    upsert: true
                }
            };
        });

        if (operaciones.length > 0) {
            console.log(`Enviando operaciones a la base de datos...`);
            const resultado = await collection.bulkWrite(operaciones);
            
            console.log(`
            🏁 SINCRONIZACIÓN COMPLETADA
            ----------------------------
            Insertados (Nuevos):  ${resultado.upsertedCount}
            Actualizados (Datos): ${resultado.modifiedCount}
            Verificados (Iguales): ${resultado.matchedCount}
            `);
        } else {
            console.log("El JSON estaba vacío.");
        }

    } catch (error) {
        console.error("Error crítico durante el seed:", error);
    } finally {
        await client.close();
    }
}

main();