// Generación correo HTML para la confirmación del pedido
export const orderConfirmationTemplate = (order,paymentMethod) => {
    return `
    <html>
        <head>
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f8f8;
            color: #333;
          }
          .container {
            max-width: 600px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: auto;
          }
          h2 {
            color: #694a6d;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
          .details {
            background: #f2f2f2;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #694a6d;
            color: white;
          }
          .img-container {
            text-align: center;
            padding: 10px;
          }
          img {
            max-width: 60px;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h2>¡Gracias por tu compra, ${order.full_name}!</h2>
        <p>Tu pedido ha sido procesado con éxito. A continuación los detalles:</p>
        
        <h3>📚 Libros Comprados:</h3>
        <table border="1" cellspacing="0" cellpadding="10">
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
          ${order.books
            .map(
              (item) => `
            <tr>
              <td><img src="${item.book_id.image}" width="50"/></td>
              <td>${item.book_id.title}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)}€</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <h3>💳 Método de Pago:</h3>
        <p>${paymentMethod}</p>

        <h3>📦 Dirección de Envío:</h3>
        <p>${order.address}, ${order.city}, ${order.country} - ${order.zip_code}</p>

        <p>Gracias por confiar en nosotros.</p>
      </body>
    </html>
  `;
};