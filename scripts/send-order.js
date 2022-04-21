function validate(form) {
    var name, phone, pattern_name;

    name = $.trim(form.find('input[name="name"]').val());
    phone = form.find('input[name="phone"]').val().replace(/\D+/g, "");

    pattern_name = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;

    $.errors = false;

    if ((name.length < 2) || (pattern_name.test(name) == false)) {
        alert('Введите корректное имя!');
        $.errors = true;
        form.find('input[name="name"]').focus();
        return false;
    }

    if (phone.length < 11) {
        alert('Введите корректный номер телефона!');
        $.errors = true;
        form.find('input[name="phone"]').focus();
        return false;
    }
}

function send_order(form) {
    var order_array = {},
        dop = '';

    order_array['name'] = form.find('input[name="name"]').val();
    order_array['phone'] = form.find('input[name="phone"]').val();
    order_array['url'] = form.find('input[name="url"]').val();
    var $address = form.find('input[name="address"]');
    if ($address.length > 0) {
        order_array['delivery_address'] = $address.val();
    }
    order_array['firstname_lastname'] = form.find('input[name="firstname_lastname"]').val();

    order_array['items'] = [];

    if (form.find('.model').length > 0) {
        order_array['items'].push(form.find('.model').data('id'));
    }

    if (form.find('.custom-checkbox_input').length > 0) {
        form.find('.custom-checkbox_input').each(function () {
            if (($(this).prop("checked"))) {
                dop = $(this).data('dop');

                if (dop === 'set_profi') {
                    order_array['items'] = order_array['items'].concat([
                        'jfh884zm43d',
                        'sTTn-S-uhLKfOaUhN6QyJ2',
                        'sTTn-S-uhLKfOaUhN6QyJ2',
                        'x5viCz3EglvghjoaYqg6f0'
                    ]);
                    order_array['set'] = dop;
                } else {
                    order_array['items'].push($.goods[dop].id);
                }
            }
        });
    }

    if (form.find('input[name="prepayment"]')) {
        order_array['prepayment'] = form.find('input[name="prepayment"]').val();
    }

    if (form.hasClass('consultation-form')) {
        window.dataLayer.push({'event': 'callback_submit'});
    } else if (form.hasClass('hr')) {
        window.dataLayer.push({'event': 'hr-order'});
    } else {
        window.dataLayer.push({'event': 'zakaz_submit'});
    }

    $.fancybox.close();
    form.find('input[type=text]').val('');

    var products = [];
    var revenue = 0;
    for (let i = 0; i < order_array.items.length; i++) {
        products.push(window.products[order_array.items[i]]);
        try {
            revenue += parseInt(window.products[order_array.items[i]].price);
        } catch (e) {
            console.log('order_array.items[i]', order_array.items[i]);
        }
    }
    window.ee.ecommerce.purchase.actionField.revenue = revenue;
    window.ee.ecommerce.purchase.products = products;

    $.ajax({
        url: '/request/order',
        type: 'post',
        data: order_array,
        success: (data) => {
            if (data.success) {
                var redirectUrl = (data.redirect === true && form.hasClass('online-payment')) ? '/oplata' : '/dopolnitelno';
                $('#verify-phone').data('redirect-url', redirectUrl);
                $('#verify-phone .info').html($.message);
                $('#verify-phone').data('order-id', data.order_id);
                $('#verify-phone input[name="name"]').val(order_array['name']);
                $('#verify-phone input[name="phone"]').val(order_array['phone']);

                window.ee.ecommerce.purchase.actionField.id = data.order_id;
                window.dataLayer = window.dataLayer || [];
                dataLayer.push(window.ee);

                if (form.hasClass('consultation-form')) {
                    $('#verify-phone').data('no-redirect', 1);
                    $.fancybox.open({
                        src  : '#verify-phone',
                        opts : {
                            afterClose : function (instance, current) {
                                $('#message .offer').text('Спасибо, ваша заявка принята!');
                                $('#message .message-text').html($.message);
                                $.fancybox.open($('#message'));
                            }
                        }
                    });
                } else {
                    // $('#book-modal .message-text').html($.message);
                    // $('#book-modal').data('order-id', data.order_id)
                    // $.fancybox.open({
                    //     src  : '#book-modal',
                    //     opts : {
                    //         afterClose : function (instance, current) {
                    //             if (data.redirect === true) {
                    //                 location.href = '/dopolnitelno';
                    //             }
                    //         }
                    //     }
                    // });
                    $.fancybox.open({
                        src  : '#verify-phone',
                        opts : {
                            afterClose : function (instance, current) {
                                if (data.redirect === true) {
                                    location.href = redirectUrl;
                                }
                            }
                        }
                    });
                }

                order_array = [];
            } else {
                $('#message .offer').text('Ошибка!');
                $('#message .message-text').html('У нас технические проблемы. Перезвоните, пожалуйста, по номеру 8 800 302 84 15. Дарим адаптер.');
                $.fancybox.open($('#message'));
                order_array = [];
            }
        }
    });
}

function edit_order() {
    $('#book-modal .feedback-form').on('submit', function (e) {
        e.preventDefault();
        $this = $(this);
        var order_id = $('#book-modal').data('order-id');
        var email = $this.find('input[name="email"]').val();
        if (!validate_email(email)) {
            alert('Введите корректный email!');
            $this.find('input[name="email"]').focus();
            return false;
        }
        $.fancybox.close();
        $.ajax({
            url: '/request/order/edit',
            type: 'post',
            data: $this.serialize() + `&order_id=${order_id}`,
            success: function (data) {
                if (data.success) {
                    if (data.redirect === true) {
                        location.href = '/dopolnitelno';
                    } else {
                        $this.trigger('reset');
                        $('#message .offer').text('Благодарим Вас!');
                        $('#message .message-text').html('Книга придет к Вам на электронную почту через 1-2 дня после того, как вы получите свой заказ.');
                    }
                } else {
                    $('#message .offer').text('Ошибка!');
                    $('#message .message-text').html('К сожалению, не удалось отправить заявку.');
                }
                if (data.redirect !== true) {
                    $.fancybox.open($('#message'));
                }
            }
        });
    });
}

function validate_email(email) {
    return /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(email);
}

edit_order();