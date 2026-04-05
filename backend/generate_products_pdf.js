const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const path = require('path');

// Load env vars
dotenv.config();

const generatePDF = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        
        const doc = new PDFDocument({ margin: 50 });
        const outputPath = path.join(__dirname, '..', 'products_list.pdf');
        const writeStream = fs.createWriteStream(outputPath);
        
        doc.pipe(writeStream);
        
        doc.fontSize(20).text('Products List Configuration', { align: 'center' });
        doc.moveDown(2);
        
        const columnWidths = { name: 220, brand: 100, price: 80, stock: 80 };
        const startX = 50;
        
        let headerY = doc.y;
        
        // Headers
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Product Name', startX, headerY, { width: columnWidths.name });
        doc.text('Brand', startX + columnWidths.name, headerY, { width: columnWidths.brand });
        doc.text('Price (Rs)', startX + columnWidths.name + columnWidths.brand, headerY, { width: columnWidths.price });
        doc.text('Stock', startX + columnWidths.name + columnWidths.brand + columnWidths.price, headerY, { width: columnWidths.stock });
        
        doc.moveDown(0.5);
        
        // Separator
        doc.moveTo(startX, doc.y).lineTo(540, doc.y).stroke();
        doc.moveDown(0.5);
        
        // Products List
        doc.font('Helvetica');
        for (const product of products) {
            let rowY = doc.y;
            
            // Check if we need to add a new page
            if (rowY > 700) {
                doc.addPage();
                rowY = doc.y;
                doc.fontSize(12).font('Helvetica-Bold');
                doc.text('Product Name', startX, rowY, { width: columnWidths.name });
                doc.text('Brand', startX + columnWidths.name, rowY, { width: columnWidths.brand });
                doc.text('Price (Rs)', startX + columnWidths.name + columnWidths.brand, rowY, { width: columnWidths.price });
                doc.text('Stock', startX + columnWidths.name + columnWidths.brand + columnWidths.price, rowY, { width: columnWidths.stock });
                doc.moveDown(0.5);
                doc.moveTo(startX, doc.y).lineTo(540, doc.y).stroke();
                doc.moveDown(0.5);
                doc.font('Helvetica').fontSize(12);
                rowY = doc.y;
            }
            
            // Output product details
            const name = product.name || 'N/A';
            const brand = product.brand || 'N/A';
            const price = product.price != null ? String(product.price) : 'N/A';
            const stock = product.countInStock != null ? String(product.countInStock) : 'N/A';
            
            // We use text with width to auto wrap lines
            // Calculate max height for this row based on name text width
            const currentY = doc.y;
            doc.text(name, startX, currentY, { width: columnWidths.name, align: 'left' });
            
            // Write other columns at the same initial Y
            doc.text(brand, startX + columnWidths.name, currentY, { width: columnWidths.brand });
            doc.text(price, startX + columnWidths.name + columnWidths.brand, currentY, { width: columnWidths.price });
            doc.text(stock, startX + columnWidths.name + columnWidths.brand + columnWidths.price, currentY, { width: columnWidths.stock });
            
            // Move down explicitly for the next row
            doc.moveDown(0.5);
        }
        
        doc.end();
        
        writeStream.on('finish', () => {
            console.log(`PDF successfully generated and saved at: ${outputPath}`);
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        process.exit(1);
    }
};

generatePDF();
