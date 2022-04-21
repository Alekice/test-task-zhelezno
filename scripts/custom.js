$(document).ready(function () {
    
    var clickEvent = document.ontouchstart !== null ? 'click' : 'touchstart';
    
    // преобразование select в ul/li
    var  selects = [];
    $('body').find('.custom-list').each(function() {
        selects.push($(this));
    });
    
    selects.forEach(function(item, i, selects) {
        // Элемент select, который будет замещаться:
        var select = item;
        var selectBoxContainer = $('<div>',{
            class: 'custom-select',
            html: '<div class="selectBox"></div>'
        });
        var dropDown = $('<ul>',{class:'dropDown'});
        var selectBox = selectBoxContainer.find('.selectBox');

        // Цикл по оригинальному элементу select
        select.find('option').each(function(i){
            var option = $(this);
            
            if (select.find(':selected').length > 0){
                selectBox.html(select.find(':selected').text());    
            } else {
            
                if(i==0){
                    selectBox.html(option.text());
                    //return true;
                }   
            }

            // Создаем выпадающий пункт в соответствии с данными select:
            var li = $('<li>',{
                html: option.text()
            });
            li.on('click touchstart', function(){
                selectBox.html(option.text());
                dropDown.trigger('hide');

                // Когда происходит событие click, мы также отражаем изменения в оригинальном элементе select:
                select.val(option.val());
                return false;
            });

            dropDown.append(li);
        });

        selectBoxContainer.append(dropDown.hide());
        select.hide().after(selectBoxContainer);    
    
        // Привязываем пользовательские события show и hide к элементу dropDown:
        dropDown.bind('show',function(){
            if(dropDown.is(':animated')){
                return false;
            }
            selectBox.addClass('expanded');
            dropDown.slideDown();

        }).bind('hide',function(){
            if(dropDown.is(':animated')){
                return false;
            }
            selectBox.removeClass('expanded');
            dropDown.slideUp();

        }).bind('toggle',function(){
            if(selectBox.hasClass('expanded')){
                dropDown.trigger('hide');
            }
            else dropDown.trigger('show');
        });

        selectBox.on('click touchstart', function(){
            dropDown.trigger('toggle');
            return false;
        });

        // Если нажать кнопку мыши где-нибудь на странице при открытом элементе dropDown, он будет спрятан:
        $(document).on('click touchstart', function(){
            dropDown.trigger('hide');
        });
        
    });    
    

    
    // всплывающее окно
    $(".fancybox").on(clickEvent, function(e){
        e.preventDefault();
        
        var dop_popup, model, dop, additional_dop, item, form;
        
        dop_popup = $(this).attr('href');
        
        if ($(this).data('model')){
            model = $(this).data('model');
        } else {
            model = $(dop_popup).find('.model').val();
        }
        
        dop = $(this).data('dop').split('__'); // если несколько допов
        additional_dop = $(this).data('additional'); // дополнительный товар с блока допов 
        
        // сброс чекбоксов
        $(dop_popup).find('.custom-checkbox_input').each(function() {
            if ($(this).is(':checked')) {
                $(this).prop('checked', false);
                $(this).removeClass('checked');
            }
        });
        
        // ставим галочки на чекбоксах, если выбран какой-то доп        
        $(dop_popup).find('.custom-checkbox_input').each(function() {
            item = $(this).data('dop');     
            
            if ((dop.indexOf(item) != -1)||(item == additional_dop)) {
                $(this).prop('checked', true);
                $(this).addClass('checked');
                $(dop_popup).find('.item-' + item).addClass('active');
                $(this).parent().removeClass('hidden');
            } 
        });        
        
        form = $(dop_popup).find('.form-container');
        
        if ($(dop_popup).find('.dop-ulitka').length > 0){
            $(dop_popup).find('.dop-ulitka').addClass('hidden');            
        }
        
        calc_sum(form);        
        
        $.fancybox.open($(dop_popup));
    });

    // галерея
    $(".fancybox-gallery").fancybox({
        loop: true,
        animationEffect: 'zoom',
        transitionEffect: 'slide',
        transitionDuration: 500
    });

    // наведение на миниатюры галереи
    var a=jQuery;
    a(".gallery a").mouseenter(function() {
        var b=a("div.item_zoom",this);
        if(!b.length){
            b=a('<div class="item_zoom" style="position:absolute">').hide().appendTo(this);a("img:first",b).detach();
        }
        b.fadeIn("fast")
    })
    .mouseleave(function(){a("div",this).fadeOut("fast")}); 
    
    // FAQ
    $('#faq li').on(clickEvent, function () {
        $(this).toggleClass('opened');
        if ($(this).hasClass('opened')) {
            $(this).find('.answer').slideDown(300);
        } else {
            $(this).find('.answer').slideUp(300);
        }
    });
    $('#faq li .answer').on(clickEvent, function (e) {
        e.stopPropagation();
    });
    
    // меню на мобильных
    $('#top .menu-container span').on(clickEvent, function() {
        $('#top .menu').toggleClass('visible');
    });    
    
    // плавная прокрутка
    $('.button-scroll').on(clickEvent, function() {
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
        }
        $('#top .menu').toggleClass('visible');
        return false;
    });  
    
    // подгрузка видео с YouTube при скроллинге
    function loadVideo(videoUrl, videoBlock) {
        var videoTag = '<iframe src="' + videoUrl + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        $(videoBlock).html(videoTag);
    }

    function loadShowVideo (videoUrl, videoBlock) {
        if ($('*').is(videoBlock)) {
            var vFlag = true;
            $(window).on('scroll',function(){
                if ($(window).scrollTop() > ($(videoBlock).offset().top - 2000) && vFlag) {
                vFlag = false;
                    if ($(videoBlock).find('iframe').length == 0) {
                        loadVideo(videoUrl, videoBlock);
                    }
                }
            });
        }
    }

    loadShowVideo('https://www.youtube.com/embed/Eb4Y1Tglc4c', '#vintagist'); 
    loadShowVideo('https://www.youtube.com/embed/1GjlSN_ewLw', '#prokat_60x40');
    loadShowVideo('https://www.youtube.com/embed/3yL4j474GEY', '#gibbon_v2');
    loadShowVideo('https://www.youtube.com/embed/uo5JVUyM7vg', '#gibbon-overview');    
    loadShowVideo('https://www.youtube.com/embed/97-EghlXo7Y', '#kak_zarabotat');
    loadShowVideo('https://www.youtube.com/embed/ROEobmBHVec', '#trubu_ne_vedet');
    loadShowVideo('https://www.youtube.com/embed/M3ZvxpEHFxI', '#trubogib_1');
    // loadShowVideo('https://www.youtube.com/embed/D5xMow2cyCc', '#naves_dlya_trakt');
    loadShowVideo('https://www.youtube.com/embed/I6-XMEzWceA', '#obzor_trubogiba');
    loadShowVideo('https://www.youtube.com/embed/H4uYEC--M9M', '#mebel_loft');
    loadShowVideo('https://www.youtube.com/embed/PyHc7cS_EZM', '#naves_kozyrek');

    // слайдеры на мобильных
    if (document.documentElement.clientWidth < 768) {
        init_slider();
    }

    $(window).resize(function () {
        if (document.documentElement.clientWidth < 768) {
            if (!($('.mobile-slider').hasClass('slick-slider'))) {
                init_slider();
            }
        } else {
            if ($('.mobile-slider').hasClass('slick-slider')) {
                $('.mobile-slider').slick('unslick');
            }
        }
    });

    // заказ конкретной модели
    $('#models .button').on(clickEvent, function () {
        var model, dop;
        
        model = $(this).data('model');
        dop = $(this).data('dop');
        
        /*if (model != 'gibbon_econom'){
            $('#order-model').find('.no-lite').removeClass('unavailable');
        } else {
            $('#order-model').find('.no-lite').addClass('unavailable');
        }*/      
        
        $('#order-model .model').val(model);
        $('#order-model .model').attr('data-id', $.goods[model].id);
        if (dop == ''){
            $('#order-model .form-title .model-name').text($.goods[model].name);
        }
        $('#order-model .form-title .discount').text($.goods[model].discount);
        $('#order-model .form-title .new-price span').text(($.goods[model].new_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        $('#order-model .img-container img').attr('src', $.goods[model].image);
        
        form = $('#order-model .form-container');
        
        calc_sum(form);
    });
    
    // заказ основного товара с дополнительным
    $('#dops .button').on(clickEvent, function () {
        var dop, additional_dop, dop_popup, form, model;
        
        if ($('#order-modal').find('.custom-list').length > 0){
            model = $('#order-modal .custom-list').val();
        }      
        
        // если выбрана модель Гиббон Эконом - переключаем на обычного Гиббона, чтобы доп был доступен
        /*if (model == 'gibbon_econom'){
            model = 'gibbon';
            $('#order-modal .model').val(model);
            $('#order-modal .model').attr('data-id', $.goods[model].id);
            $('#order-modal .form-title .model-name').text($.goods[model].name);
            $('#order-modal .form-title .discount').text($.goods[model].discount);
            $('#order-modal .form-title .new-price span').text(($.goods[model].new_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
            $('#order-modal .img-container img').attr('src', $.goods[model].image);   
            $('#order-modal .selectBox').text($.goods[model].name);
            $('#order-modal select option[value=' + model + ']').prop('selected', true);
            $('#order-modal').find('.no-lite').removeClass('unavailable');
        }*/
        
        dop = $(this).data('dop');        
        additional_dop = $(this).data('additional');
        
        $('#order-modal .custom-checkbox_input').each(function() {
            item = $(this).data('dop');
            if ((item == dop)||(item == additional_dop)){
                $(this).prop('checked', true);
                $(this).addClass('checked');
            }
        });
        
        if (additional_dop == 'ulitka'){
            $('#order-modal .dop-ulitka').removeClass('hidden');
        } else {
            $('#order-modal .dop-ulitka').addClass('hidden');
        }
        
        form = $('#order-modal .form-container');
        
        calc_sum(form);
    });

    // обновление информации на форме с выбором модели
    $('.custom-select li').on('click touchstart', function() {
        var model, form;

        model = $(this).closest('form').find('.custom-list').val();
        form = $(this).closest('.form-container');
        
        /*if (model != 'gibbon_econom'){
            form.find('.no-lite').removeClass('unavailable');
        } else {
            form.find('.no-lite').addClass('unavailable');
            form.find('.no-lite .custom-checkbox_input').removeClass('checked');
            form.find('.no-lite .custom-checkbox_input').prop('checked', false);
        }*/      
        
        form.find('.model').attr('data-id', $.goods[model].id);
        form.find('.model').val(model);
        form.find('.model-name').text($.goods[model].name);
        form.find('.form-title .discount').text($.goods[model].discount);
        form.find('.img-container img').attr('src', $.goods[model].image);
        
        calc_sum(form);
    }); 
    

    // обработка чекбоксов
    $('.custom-checkbox_input').on('click touchstart', function() {
        var form, dop;
        
        form = $(this).closest('.form-container');
        dop = $(this).data('dop');
        
        if ($(this).is(':checked')) {
            $(this).addClass('checked');
            if (form.find('.model-name').hasClass(dop)){
                form.find('.model-name').text(form.find('.model-name').data('model'));
            }          
        } else {
            $(this).removeClass('checked');
            if (form.find('.model-name').hasClass(dop)){
                form.find('.model-name').text('');
            }    
        }        
        
        calc_sum(form);
        
        // для черной пятницы
        if ((form.parent().attr('id') == 'black-friday-popup')&&(dop != 'set_profi')){
            friday();
        }        

    });    
    
    // выбор комплектующих
    $('#select-kit .parameter .available').on('click', function() {
        var item, parent;
        item = '#item-' + $(this).parent().attr('id');
        
        $(this).toggleClass('selected');
        
        if ($(item).hasClass('parent')){
            parent = '.' + $(item).data('item');
        }        

        if ($(this).hasClass('selected')){            
            $('#order-kit').find(item).addClass('active');
            $('#order-kit').find(parent).addClass('active');
        } else {
            $('#order-kit').find(item).removeClass('active');
            $('#order-kit').find(parent).removeClass('active');
        }

        update_total();
    });    
    
    // выбор комплектующего с вариантами
    $('#select-kit .parameter .gibbon-models span').on('click touchstart', function() {
        var item, model, selected_model, dop;
        item = $(this).closest('.parameter').attr('id');
        selected_model = '#item-' + $(this).data('item');
        
        /*if ($(this).data('item') == 'gibbon_econom'){
            $('#order-kit .parameter').each(function(){
                dop = $(this).attr('id');
                if ($(this).hasClass('no-lite')){
                    $(this).addClass('unavailable');
                    $(this).find('.available').removeClass('selected');
                    $('#order-kit .img-container').find('#item-' + dop).removeClass('active');
                }
            });
        } else {
            $('#order-kit').find('.no-lite').removeClass('unavailable');
        }*/
        
        $(this).parent().find('span').removeClass('selected');
        $(this).addClass('selected');
        
        $('#order-kit .img-container').find('.' + item).removeClass('active');
        $('#order-kit .img-container').find(selected_model).addClass('active');
        $(this).closest('.parameter').find('.price span').text($.goods[$(this).data('item')].new_price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "));
        $(this).closest('.parameter').find('.price-old span').text($.goods[$(this).data('item')].old_price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "));
        
        update_total();
  
    });    
    
    // формируем заказ из выбранных товаров
    $('#select-kit .button').on('click touchstart', function() {        
        var item;
        
        if ($('#order-kit .img-container').find('.active').length > 0){
        
            // сбрасываем чекбоксы
            $('#quick-order form .custom-checkbox_input').prop('checked', false);
        
            $('#order-kit .img-container .active').each(function(){
                item = $(this).attr('id').split('-')[1];
                if ($(this).hasClass('gibbon')){
                    $('#quick-order form .model').val(item);
                    $('#quick-order form .model').attr('data-id', $.goods[item].id);                    
                } else {
                    $('#quick-order form .custom-checkbox_input').each(function(){
                        if ($(this).data('dop') == item){
                            $(this).prop('checked', true);
                        }
                    });
                }
            });                    

            $.fancybox.open({src  : '#quick-order',	type : 'inline'});
        }       
        
    });  
    
    // на странице /dopolnitelno добавляем к заказу и вставляем в попап имя допа

    var $dopName = $('#just-added .dop-name'),
        $dopButton = $('[href*="#just-added"]');

    $dopButton.one('click', function () {
        var $this = $(this);
        var dop = $this.data('dop');
        var external_id = $.goods[dop]['id'];
        var order_id = $this.data('orderId');
        var quantity = $this.closest('.adds-card').find('input').val() !== undefined
            ? $this.closest('.adds-card').find('input').val() : 1;

        // var products = [];
        // var revenue = 0;
        // window.products[external_id].quantity = quantity;
        // products.push(window.products[external_id]);
        // revenue += parseInt(window.products[external_id].price) * quantity;
        // window.ee.ecommerce.purchase.actionField.revenue = revenue;
        // window.ee.ecommerce.purchase.products = products;

        $.ajax({
            url: '/request/order/add',
            type: 'post',
            data: `order_id=${order_id}&external_id=${external_id}&quantity=${quantity}`,
            success: function (data) {
                if (data.success) {
                    $dopName.text($this.attr('data-dopName'));
                    $this.css({
                        'font-size': '18px',
                        'background-color': '#194d38',
                        'cursor': 'default',
                        'event-pointer': 'none'
                    });
                    $this.text('Товар добавлен в заказ');
                    $.fancybox.open($('#just-added'));

                    // window.ee.ecommerce.purchase.actionField.id = data.order_id;
                    // window.dataLayer = window.dataLayer || [];
                    // dataLayer.push(window.ee);
                } else {
                    $('#message .offer').text('Ошибка!');
                    $('#message .message-text').html('К сожалению, не удалось добавить товар в заказ.');
                    $.fancybox.open($('#message'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 500) {
                    alert('Internal error: ' + jqXHR.responseText);
                } else {
                    alert('Unexpected error.');
                }
            }
        });

    });

    var plus = $('.adds-card .plus'),
        minus = $('.adds-card .minus');

    plus.on('click', function () {
        console.log($(this).siblings('.count'));
        let quant = +$(this).siblings('.count').val();
        console.log(quant);
        $(this).siblings('.count').val(quant + 1);
    });
    minus.on('click', function () {
        let quant = +$(this).siblings('.count').val();
        console.log(quant);
        if (quant > 1) {
            $(this).siblings('.count').val(quant - 1);
        }
    }); 
    
    $('.count').on('input', function() {
        $(this).val($(this).val().replace(/[A-Za-zА-Яа-яЁё]/, ''))
    }); 
    


function init_slider() {
    $('.mobile-slider').slick({
        infinite: true,
        arrows: true,
        dots: false,
        adaptiveHeight: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });
}

function calc_sum(form) {
    var price = 0,
        old_price = 0,
        model = '',
        dop = '',
        comment = '';
    
    model = form.find('.model').val();
    price = $.goods[model].new_price;
    old_price = $.goods[model].old_price;
    
    form.find('.custom-checkbox_input').each(function() {
        if (($(this).prop("checked"))) {
            dop = $(this).data('dop');
            price += $.goods[dop].new_price;
            old_price += $.goods[dop].old_price;
            comment += $.goods[dop].name + '; '
        }
    });        

    if (form.find('.new-price').length > 0){
        form.find('.new-price span').text(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));        
    }
    if (form.find('.old-price').length > 0){
        form.find('.old-price span').text(old_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    }
    if (form.find('.comment').length > 0){
        form.find('.comment').val(comment);        
    }    
}

function update_total(){
    var sum = 0;
    $('#select-kit .parameter').each(function(){
        if ($(this).find('.selected').length > 0){
            sum += parseInt($(this).find('.price span').text().replace(' ', ''));
        }
    });
    $('#total-price .price').text(sum.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "));
}
    
// кнопка подробнее в УТП на мобильной версии

   $('button.mobile-short').on('click', function () {
        $(this).prev('.mobile-hide').toggleClass('mob-visible');
        if ($(this).prev('.mobile-hide').hasClass('mob-visible')) {
            $(this).text('Свернуть');
            $(this).siblings('.short-mobile .text .title-container').css('border-bottom', '2px solid #e5e5e5');
        } else {
            $(this).text('Подробнее');
            $(this).siblings('.short-mobile .text .title-container').css('border-bottom', 'none');
        }
    });

//переход на блок #models по кнопке "посмотреть все модели" со страниц маркета

var url  = window.location.href; 
if (url.search('/#models') != -1)  {
  setTimeout(scrollToModels, 1000);
} 

function scrollToModels () {
    $('html, body').animate({
        scrollTop: ($("#models").offset().top) }, 200);
} 


// всплывашка при уходе - посмотрите ещё станки

/* 

$.close_flag = false;

setTimeout(function() {
    $(document).mouseleave(function(e) {
        if ((e.pageY - $(document).scrollTop() <= 5)&&($.close_flag == false)&&(!($("form input").is(":focus")))&&($('body').find($('#offer-modal')).length > 0)){
            $.fancybox.open($('#offer-modal'));
            $.close_flag = true;
        }
    });
}, 5000);

// передача url при переходе со всплывашки на сайт с другим товаром
       
/* $('#offer-modal .button').on('click touchstart', function(e) {
    e.preventDefault();
    var product_button = $(this);
    var product_url = product_button.data('url') + '?' + document.location.href + '&' + product_button.data('target');
    window.open(product_url, '_blank').focus();
});


// "Подробнее" на всплывашке при уходе с сайта

$('#offer-modal .model-specific').on('click', function () {
    if ($(this).siblings('.specific-list').hasClass('active')) {
        $(this).siblings('.specific-list').removeClass('active');
        $('#offer-modal .columns').css('align-items', 'stretch');
    } else {
        $(this).siblings('.specific-list').addClass('active');
        $('#offer-modal .columns').css('align-items', 'flex-start');

    }
});  
 */
});