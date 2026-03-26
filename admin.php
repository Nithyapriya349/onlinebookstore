<?php
// admin.php - A lightweight SQLite database query runner
$dbFile = __DIR__ . '/bookstore.sqlite';

if (!file_exists($dbFile)) {
    die("Database file not found. Make sure api.php has been accessed at least once to create it.");
}

$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query = isset($_POST['query']) ? trim($_POST['query']) : '';
$error = '';
$results = [];

if ($query) {
    try {
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        // If it's a SELECT or PRAGMA, fetch results
        if (preg_match('/^(SELECT|PRAGMA)/i', $query)) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $error = "Query executed successfully. Rows affected: " . $stmt->rowCount();
        }
    } catch (Exception $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Get all tables for the sidebar
$tablesStmt = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
$tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQLite Database Admin</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f9; padding: 20px; color: #333; }
        .container { display: flex; gap: 20px; max-width: 1200px; margin: 0 auto; }
        .sidebar { width: 250px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); height: max-content; }
        .main { flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h2, h3 { margin-top: 0; color: #4f46e5; }
        textarea { width: 100%; height: 120px; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-family: monospace; font-size: 14px; box-sizing: border-box; resize: vertical; }
        button { background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-top: 10px; transition: background 0.3s; }
        button:hover { background: #4338ca; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f8fafc; color: #333; }
        tr:nth-child(even) { background: #f9fafb; }
        ul { list-style-type: none; padding: 0; }
        li { margin-bottom: 8px; }
        a { color: #4f46e5; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .msg { padding: 10px; border-radius: 6px; margin-top: 15px; }
        .success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .table-wrap { overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <h3>Database Tables</h3>
            <ul>
                <?php foreach($tables as $t): ?>
                    <li>
                        <a href="#" onclick="document.getElementById('q').value='SELECT * FROM <?php echo $t; ?> LIMIT 50;'; document.forms[0].submit(); return false;">
                            &#128193; <?php echo htmlspecialchars($t); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        
        <div class="main">
            <h2>SQLite Query Runner</h2>
            <form method="POST">
                <textarea id="q" name="query" placeholder="Enter your SQL query (e.g., SELECT * FROM users)"><?php echo htmlspecialchars($query); ?></textarea>
                <button type="submit">Run Query</button>
            </form>

            <?php if ($error): ?>
                <div class="msg <?php echo stripos($error, 'Error:') === 0 ? 'error' : 'success'; ?>">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <?php if ($results): ?>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <?php foreach (array_keys($results[0]) as $col): ?>
                                    <th><?php echo htmlspecialchars($col); ?></th>
                                <?php endforeach; ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($results as $row): ?>
                                <tr>
                                    <?php foreach ($row as $val): ?>
                                        <td><?php echo htmlspecialchars((string)$val); ?></td>
                                    <?php endforeach; ?>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php elseif ($query && !$error && preg_match('/^(SELECT|PRAGMA)/i', $query)): ?>
                <p style="margin-top: 20px; color: #666;">No results returned for this query.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
