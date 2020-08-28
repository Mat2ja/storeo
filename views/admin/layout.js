module.exports = ({ content, title }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <meta name="author" content="Matija Osrečki">
        </head>

        <body>
            ${content}
        </body>
    </html>
    `
}