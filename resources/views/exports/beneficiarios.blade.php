<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
        }

        .header-institucional {
            font-weight: bold;
            text-align: center;
            font-size: 16px;
        }

        .header-titulo {
            font-weight: bold;
            text-align: center;
            font-size: 14px;
            background-color: #eeeeee;
        }

        .table-header {
            background-color: #003366;
            color: #ffffff;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000000;
        }

        .cell-data {
            border: 1px solid #000000;
            text-align: left;
            vertical-align: middle;
        }

        .cell-center {
            border: 1px solid #000000;
            text-align: center;
            vertical-align: middle;
        }

        .cell-number {
            border: 1px solid #000000;
            text-align: right;
            vertical-align: middle;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <td colspan="19" class="header-institucional">UNIVERSIDAD NACIONAL DE MOQUEGUA</td>
        </tr>
        <tr>
            <td colspan="19" class="header-institucional">DIRECCIÓN DE BIENESTAR UNIVERSITARIO</td>
        </tr>
        <tr>
            <td colspan="19"></td>
        </tr>
        <tr>
            <td colspan="19" class="header-titulo">RELACIÓN DE ESTUDIANTES BENEFICIARIOS DEL SERVICIO DE COMEDOR
                UNIVERSITARIO</td>
        </tr>
        <tr>
            <td colspan="19" style="text-align: center;">Fecha de Reporte: {{ date('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <td colspan="19"></td>
        </tr>
    </table>

    <table border="1">
        <thead>
            <tr>
                <th class="table-header" width="5">N°</th>
                <th class="table-header" width="15">CÓDIGO</th>
                <th class="table-header" width="12">DNI</th>
                <th class="table-header" width="20">APELLIDO PATERNO</th>
                <th class="table-header" width="20">APELLIDO MATERNO</th>
                <th class="table-header" width="25">NOMBRES</th>
                <th class="table-header" width="30">EMAIL</th>
                <th class="table-header" width="12">TELÉFONO</th>
                <th class="table-header" width="25">ESCUELA</th>
                <th class="table-header" width="20">FACULTAD</th>
                <th class="table-header" width="30">DIRECCIÓN</th>
                <th class="table-header" width="15">INGRESO (S/.)</th>
                <th class="table-header" width="10">CARGA</th>
                <th class="table-header" width="15">VIVIENDA</th>
                <th class="table-header" width="20">CONVOCATORIA</th>
                <th class="table-header" width="15">FECHA APROB.</th>
                <th class="table-header" width="10">ASIST.</th>
                <th class="table-header" width="10">FALTAS</th>
                <th class="table-header" width="15">ESTADO</th>
            </tr>
        </thead>
        <tbody>
            @foreach($beneficiarios as $index => $b)
                <tr>
                    <td class="cell-center">{{ $index + 1 }}</td>
                    <td class="cell-center">{{ $b->usuario->codigo ?? '-' }}</td>
                    <td class="cell-center">{{ $b->usuario->dni ?? '-' }}</td>
                    <td class="cell-data">
                        {{ $b->usuario->apellido_paterno ?? (explode(' ', $b->usuario->apellidos ?? '')[0] ?? '-') }}</td>
                    <td class="cell-data">
                        {{ $b->usuario->apellido_materno ?? (explode(' ', $b->usuario->apellidos ?? '')[1] ?? '-') }}</td>
                    <td class="cell-data">{{ $b->usuario->nombres }}</td>
                    <td class="cell-data">{{ $b->usuario->email }}</td>
                    <td class="cell-center">{{ $b->usuario->telefono ?? '-' }}</td>
                    <td class="cell-data">{{ $b->usuario->escuela ?? '-' }}</td>
                    <td class="cell-data">{{ $b->usuario->facultad ?? '-' }}</td>
                    <td class="cell-data">{{ $b->usuario->direccion_actual ?? '-' }}</td>
                    <td class="cell-number">{{ number_format($b->ingreso_familiar ?? 0, 2) }}</td>
                    <td class="cell-center">{{ $b->numero_miembros ?? '-' }}</td>
                    <td class="cell-center">{{ strtoupper($b->condicion_vivienda ?? '-') }}</td>
                    <td class="cell-data">{{ $b->convocatoria->nombre ?? '-' }}</td>
                    <td class="cell-center">{{ $b->updated_at->format('d/m/Y') }}</td>
                    <td class="cell-center" style="background-color: #e6fffa;">{{ $b->asistencias_count ?? 0 }}</td>
                    <td class="cell-center" style="background-color: #fff5f5; color: red;">{{ $b->faltas_count ?? 0 }}</td>
                    <td class="cell-center font-bold">{{ strtoupper($b->estado) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>