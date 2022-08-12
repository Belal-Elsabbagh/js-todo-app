$(function () {

    $('form').on('submit', function () {
        var item = $('form input');
        var todo = { task: item.val() };

        $.ajax({
            type: 'POST',
            url: '/todo',
            data: todo,
            success: function (data) {
                location.reload();
            }
        });

        return false;

    });

    $('li.tasks-undone').on('click', function () {
        console.log('clicked')
        $.ajax({
            type:'POST',
            url: '/todo/complete/' + $(this).text().replace(/ /g, "-"),
            success: function (data) {
                location.reload();
            }
        });
    });

    $('li.tasks-done').on('click', function () {
        console.log('clicked')
        $.ajax({
            type:'POST',
            data: {'action': 'delete'},
            url: '/todo/delete/' + $(this).text().replace(/ /g, "-"),
            success: function (data) {
                location.reload();
            }
        });
    });
});