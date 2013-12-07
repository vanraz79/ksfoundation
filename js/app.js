$(document).ready(function(){
    // filters
    if($('.ks-filter').length) {
        var thisUrl = window.location.href;
        if(thisUrl.indexOf("?") > -1) {
            var dela = (thisUrl.split('?').pop().split('&')[0]).split('=')[1];
            var panala = (thisUrl.split('?').pop().split('&')[1]).split('=')[1];
        } else {
            var dela = 0;
            var panala = 100000;

        }
            prices = [];
            var allProducts = $('.product-listing').children("li");

            $(allProducts).each(function () {
            var price = parseFloat($(this).data('price'));
            prices.push(price);
            if((price < dela) || (price > panala)) {
                $(this).animate({
                    opacity: 0.2
                },1000);
            }
            });

            prices.sort(function(a, b) { return a - b });
            minprice = prices[0];
            maxprice = prices[prices.length - 1];

            var step1 = Math.round(((maxprice - minprice) / 3 + minprice) / 10) * 10;



            var urlRange = thisUrl.split('?')[1];

            console.log(urlRange);

            var range1 = "dela=" + minprice + "&panala=" + step1;
            var range2 = "dela=" + step1 + "&panala=" + maxprice;

            if(urlRange == range1) {
                var range1class = "active";
            }

            if(urlRange == range2) {
                var range2class = "active";
            }
            // create the range links and push to markup
            $('.filters').append(
                "<li><a class='"+ range1class +"' href='?"+ range1 +"'>"+ minprice +" - "+ step1 +"</a></li><li><a class='"+ range2class +"' href='?"+ range2 +"'>"+ step1 +" - "+ maxprice +"</a></li>");

    }

    $("#notes").notify(); //initialize the growl like infos
    $(".popmeup").fancybox(); //fancy gallery
    refreshCart(); //update cart box

    if($('.dovoucher').length) {
        generateVoucher("","");

       $("#voucher_value").keyup(function() {
         var voucherValue = $(this).val();
         var voucherCode = $('#voucher_code').val();
         generateVoucher(voucherValue, voucherCode);
       });

       $("#voucher_code").keyup(function() {
         var voucherCode = $(this).val();
         var voucherValue = $('#voucher_value').val();
         generateVoucher(voucherValue, voucherCode);
       });
    }

    // Cart related
    $("#submitCart").click(function(){
            if ($("input[name=promotion_code]").val() != "")
            {
                $.get("/api/promotions.json",
                    {code:$("input[name=promotion_code]").val()},
                    function(ret){
                        if (! ret.length)
                        {
                            alert("Codul introdus nu este valabil. Vă rugăm introduceți codul primit pe mail. ");
                            $("input[name=promotion_code]").focus();
                        }
                        else
                        {
                            $("#cartForm").submit();
                        }
                    }, "json");

            }
            else
            {
                $("#cartForm").submit();
            }
        });


    //add product with ajax
    // $('.add-to-cart-button').click(function(){
    //     $.post('/cart/add.json', $(this).closest("form").serialize(),
    //         function(output) {
    //            refreshCart();
    //            if(output.added) {
    //                 $("#notes").notify("create", "basic-template", {
    //                   image: output.product.image[0].src,
    //                   name: output.product.name
    //                 },{
    //                   expires: false,
    //                   speed: 1000
    //                 });
    //            } else {
    //                 $("#notes").notify("create", "numaisunt-template", {
    //                   name: output.product.name
    //                 },{
    //                   expires: false,
    //                   speed: 500
    //                 });
    //            }

    //         });


    //     return false;
    // });





    // PF - PJ forms
    var pjrequired = "bill_company";
    var pfrequired = "bill_cnp";
    $('.pj').click(function(){
        $('input[name=_required_fields]').val(pjrequired);
        $('input[name=bill_type]').val('1');
    });

    $('.pf').click(function(){
        $('input[name=_required_fields]').val(pfrequired);
        $('input[name=bill_type]').val('0');
    });

    // Get products by tag
    if($('.product-page').length) {
        // Get the tag
        $.getJSON(window.location.pathname + '.json',function(response){
            var tag = response.product.tags;
            if(tag != "") {
                var shownProducts = [];
                $.getJSON('/product/tag/'+ tag +'.json',function(related){
                produse = related.product.list;
                $.each(produse, function(index, item) {
                //skipping the forst step
                if(item.handle == $('h1').attr('id')) {
                    return true;
                }


                  var html = '<li><form action="/cart/add" method="POST"><div class="thumbnail" onClick="document.location.href=&quot;/product/'+ item.id +'&quot;"><img src="'+ item.images.first +'?width=220" alt="' + item.name + '" /><strong class="name">' +   item.name + '</strong><div class="row buy"><div class="large-12 columns text-center price">' + item.price + 'Ron</div><div class="large-7 columns">';


                      if(item.stock) {
                         html += "<input type='hidden' name='pid' value='"+ item.id +"'>";
                         html += "<input type='hidden' name='quantity' value='1'>";

                      } else {
                       // html += "<span class='oos'>Stoc epuizat!</span>";
                      }

                      html += "</div></div></div></form></li>";



                  if(jQuery.inArray(item.handle, shownProducts) === -1)
                    {

                    //not shown
                    $(html).hide().appendTo(".product-listing").delay(300*index).fadeIn(100);
                    $('.loading-bg').removeClass('loading-bg');
                    shownProducts.push(item.handle);
                    }
                    else
                    {
                        //shown - do nothing
                    }
                });
            });
        }
     });
   } // end of get related product
});


//update the cart link
function refreshCart() {
    $('body').kloudstores({
        cartInfoWrapperClass: ".cart-info",
        cartTotalClass: ".ks-cart-total",
        cartItemsClass: ".ks-cart-items"

    });
}


(function($){
    $.fn.kloudstores = function(options) {
        var options = $.extend({},$.fn.kloudstores.defaults, options);

        //make it a wrapper
        var thisJson = '/cart.json';
            $.getJSON(thisJson, function(kloudstores) {
                $(".ks-cart-total", ".cart-info").html(kloudstores.cart.total);
                $(".ks-cart-items", ".cart-info").html(kloudstores.cart.count);
        });
 };

    /* setting up the default values */
    $.fn.kloudstores.defaults = {
        cartInfoWrapperClass: "ks-cart-info",
        cartTotalClass: ".ks-cart-total",
        cartItemsClass: ".ks-cart-items"
    };
})(jQuery);


// Generate the voucher image
function generateVoucher(voucherValue, voucherCode) {
    $.post('http://eyecss.com/ks-vouchers/designbiju/?code='+ voucherCode +'&value='+ voucherValue +'', function(data) {
      $('.dovoucher').html(data);
    });
}


