const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
 
const app = express();
const PORT = 8000;
 
// Serve static files in workspace root
app.use(express.static(__dirname));
 
const server = app.listen(PORT, () => {
    console.log(`Temp server running on http://localhost:${PORT}`);
    
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const pdfPath = path.join(outputDir, 'semiconductor-ecosystem-2026.pdf');
    const chromePath = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"';
    
    // Command to run headless Chrome and print page to PDF
    // We add a page margin override in CSS @page { margin: 0; } inside index.html to hide default Chrome header/footers
    const command = `${chromePath} --headless --disable-gpu --print-to-pdf="${pdfPath}" http://localhost:${PORT}`;
    
    console.log(`Executing PDF print: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error printing PDF: ${error.message}`);
        } else {
            console.log(`PDF successfully printed to: ${pdfPath}`);
        }
        
        // Shut down server
        console.log("Shutting down temp server...");
        server.close(() => {
            console.log("Server stopped.");
            process.exit(error ? 1 : 0);
        });
    });
});
