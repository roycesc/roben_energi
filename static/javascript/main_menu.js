document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('collapse-container').addEventListener('click', function () {
        var sidebar = document.getElementById('sidebar');
        var col2 = document.querySelector('.col-2');
        sidebar.classList.toggle('collapsed');
        col2.style.width = col2.style.width === '60px' ? 'auto' : '60px';
    });

    $(document).ready(function () {
        $("#collapse-container").click(function () {
            // Rotate the collapse icon
            $("#collapse-container .material-icons").toggleClass("rotate-icon");
        });
    });
});
