const deleteProduct = () => {
    console.log('Deleting all strawberry icecream...\n');
    connection.query(
      'DELETE FROM products WHERE ?',
      {
        flavor: 'strawberry',
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} products deleted!\n`);
        // Call readProducts AFTER the DELETE completes
        readProducts();
      }
    );
  };



  const updateProduct = () => {
    console.log('Updating all Rocky Road quantities...\n');
    const query = connection.query(
      'UPDATE products SET ? WHERE ?',
      [
        {
          quantity: 100,
        },
        {
          flavor: 'Rocky Road',
        },
      ],
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} products updated!\n`);
        // Call deleteProduct AFTER the UPDATE completes
        deleteProduct();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  };