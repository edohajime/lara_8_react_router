<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>React App</title>  

    <link href="{{ asset('css/bootstrap.min.css')}}" rel="stylesheet" type="text/css">


    @if (request()->is('admin*'))
        <!-- Custom fonts for this template-->
        <link href="{{ asset('vendor/fontawesome-free/css/all.min.css')}}" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">

        <!-- Custom styles for this template-->
        <link href="{{ asset('css/sb-admin-2.min.css')}}" rel="stylesheet">
        <link href="{{ asset('css/add-product.css')}}" rel="stylesheet">
    @else
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
        <link href="{{ mix('css/app.css')}}" type="text/css" rel="stylesheet" />
    @endif

    @if(request()->is('admin/products*'))
        <!-- Custom styles for this page -->
        <link href="{{ asset('vendor/datatables/dataTables.bootstrap4.min.css')}}" rel="stylesheet">
        
    @endif


    
</head>
<body class="antialiased">
    

    <!-- React DOM Node -->
    <div id="app"></div>

    <script type="text/javascript" src="{{mix('js/app.js')}}"></script>
    
    @if (request()->is('admin*'))
        <!-- Bootstrap core JavaScript-->
        <script src="{{ asset('vendor/jquery/jquery.min.js')}}"></script>
        <script src="{{ asset('vendor/bootstrap/js/bootstrap.bundle.min.js')}}"></script>

        <!-- Core plugin JavaScript-->
        <script src="{{ asset('vendor/jquery-easing/jquery.easing.min.js')}}"></script>

        <!-- Custom scripts for all pages-->
        <script src="{{ asset('js/sb-admin-2.min.js')}}"></script>
    @endif

    @if(request()->is('admin'))
        <!-- Page level plugins -->
        <script src="{{ asset('vendor/chart.js/Chart.min.js')}}"></script>

        <!-- Page level custom scripts -->
        <script src="{{ asset('js/demo/chart-area-demo.js')}}"></script>
        <script src="{{ asset('js/demo/chart-pie-demo.js')}}"></script>
    @endif

    @if(request()->is('admin/products*'))
        <!-- Page level plugins -->
        <script src="{{ asset('vendor/datatables/jquery.dataTables.min.js')}}"></script>
        <script src="{{ asset('vendor/datatables/dataTables.bootstrap4.min.js')}}"></script>

        <!-- Page level custom scripts -->
        <script src="{{ asset('js/demo/datatables-demo.js')}}"></script>
    @endif

</body>
</html>