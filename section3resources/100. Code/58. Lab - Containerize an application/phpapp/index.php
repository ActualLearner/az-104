<html lang="en">
<head>
  <meta charset="utf-8">    
  <meta name="description" content="Displaying Courses">    
  <title>Courses</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background-color: #f9f9f9;
    }

    h1 {
      margin-bottom: 5px;
    }

    p {
      margin-top: 0;
      font-size: 1.1em;
      color: #555;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background-color: #fff;
    }

    thead {
      background-color: #343a40;
      color: #fff;
    }

    th, td {
      padding: 12px 15px;
      border: 1px solid #ddd;
      text-align: left;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #e9ecef;
    }

    th {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div>
    <h1><?php echo "List of Courses" ?></h1>
    <p>This is a list of Courses</p>

    <table>
      <thead>
        <tr>
          <th scope="col">Course ID</th>
          <th scope="col">Course Name</th>
          <th scope="col">Rating</th>            
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Docker and Kubernetes</td>
          <td>4.5</td>            
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>AI-102 Azure AI Engineer</td>
          <td>4.6</td>            
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>AZ-104 Azure Administrator</td>
          <td>4.7</td>            
        </tr>          
      </tbody>        
    </table>
  </div>
</body>
</html>
