<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
    <table>
        <thead>
            <tr>
                <td colspan="4" style="text-align: left; font-weight: bold;">
                    UNAM<br>
                    UNIVERSIDAD NACIONAL DE MOQUEGUA
                </td>
                <td colspan="4" style="text-align: right; font-weight: bold;">
                    DIRECCIÓN DE BIENESTAR UNIVERSITARIO<br>
                    SERVICIO DE COMEDOR UNIVERSITARIO
                </td>
            </tr>
            <tr>
                <td colspan="8">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="8"
                    style="text-align: center; font-weight: bold; text-decoration: underline; font-size: 14px;">
                    RELACIÓN DE ESTUDIANTES BENEFICIARIOS PARA EL SERVICIO DE COMEDOR UNIVERSITARIO
                </td>
            </tr>
            <tr>
                <td colspan="8" style="text-align: center; font-weight: bold;">
                    PERIODO ACADÉMICO {{ now()->year }}
                </td>
            </tr>
            <tr>
                <td colspan="8">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="8" style="text-align: center; font-weight: bold;">
                    GESTIÓN PÚBLICA Y DESARROLLO SOCIAL
                </td>
            </tr>
            <tr>
                <td colspan="8">&nbsp;</td>
            </tr>
            <tr style="background-color: #cccccc;">
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">N°</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">DNI</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center; width: 300px;">APELLIDOS Y
                    NOMBRES</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">CÓDIGO</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">ESCUELA PROFESIONAL</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">TELÉFONO</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">EMAIL</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">FECHA APROBACIÓN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($beneficiarios as $index => $b)
                <tr>
                    <td style="border: 1px solid #000; text-align: center;">{{ $index + 1 }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $b->usuario->dni }}</td>
                    <td style="border: 1px solid #000;">{{ $b->usuario->apellidos }} {{ $b->usuario->nombres }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $b->usuario->codigo }}</td>
                    <td style="border: 1px solid #000;">{{ $b->usuario->escuela }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $b->usuario->telefono }}</td>
                    <td style="border: 1px solid #000;">{{ $b->usuario->email }}</td>
                    <td style="border: 1px solid #000; text-align: center;">
                        {{ $b->updated_at ? $b->updated_at->format('d/m/Y') : '-' }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>