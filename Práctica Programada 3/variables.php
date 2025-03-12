<?php
$transacciones = [];

function registrarTransaccion($id, $descripcion, $monto) {
    global $transacciones;
    array_push($transacciones, [
        'id' => $id,
        'descripcion' => $descripcion,
        'monto' => $monto
    ]);
    echo "Transacción registrada: $descripcion - $$monto\n";
}

function generarEstadoDeCuenta() {
    global $transacciones;
    $montoTotalContado = 0;
    $estadoCuenta = "Estado de Cuenta:\n\n";

    foreach ($transacciones as $transaccion) {
        $montoTotalContado += $transaccion['monto'];
        $estadoCuenta .= "Transacción #{$transaccion['id']}: {$transaccion['descripcion']} - \${$transaccion['monto']}\n";
    }

    $montoConIntereses = $montoTotalContado * 1.026;

    $cashBack = $montoTotalContado * 0.001;

    $montoFinal = $montoConIntereses - $cashBack;

    $estadoCuenta .= "\nMonto Total de Contado: \$$montoTotalContado\n";
    $estadoCuenta .= "Monto con Intereses (2.6%): \$$montoConIntereses\n";
    $estadoCuenta .= "Cash Back (0.1%): \$$cashBack\n";
    $estadoCuenta .= "Monto Final a Pagar: \$$montoFinal\n";

    echo $estadoCuenta;

    file_put_contents('estado_cuenta.txt', $estadoCuenta);
}


registrarTransaccion(1, "Compra en supermercado", 150.00);
registrarTransaccion(2, "Pago de servicios", 200.00);
registrarTransaccion(3, "Compra en línea", 100.00);

generarEstadoDeCuenta();
?>