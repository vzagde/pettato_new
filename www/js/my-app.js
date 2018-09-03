/*
*   app var
*/
// var base_url = 'http://casaestilo.in/neonbuzz_d/neonbuzz_api/index.php/api';
// var image_url = 'http://casaestilo.in/neonbuzz_d/neonbuzz_api/upload_image/profile_pic/';
var base_url = 'http://notchitup.in/pettato_ci/index.php/api/';
var image_url = 'http://notchitup.in/pettato_ci/assets/uploads/upload_image/';
// var base_url = 'http://casaestilo.in/neonbuzz_d/neonbuzz_api/index.php/api_v2';
// var image_url = 'http://casaestilo.in/neonbuzz_d/neonbuzz_api/upload_image/profile_pic/';
var token = Lockr.get('token');
var user_data;
var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phone_regex = /^\d{10}$/;
var image_from_device = '';

var lat, lng;
var time = '';
var profile_image_link = '';
var profile_cover_image_link = '';
var image_upload_type = '';

var new_comment_interval = null;
var comment_time = '';
var comment_type = '';
var comment_post_id = '';
var myComment = null;
var new_comment_time = null;

var new_chat_interval = null;
var chat_time = '';
var chat_type = '';
var chat_post_id = '';
var myChat = null;
var myChatMessagebar = null;
var new_chat_time = null;

openFB.init('2106128496268926', '', window.localStorage);

var calendarDefault;

var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

var myApp = new Framework7({
    swipePanel: 'left',
    material: true,
    preloadPreviousPage: false,
    uniqueHistory: true,
    uniqueHistoryIgnoreGetParameters: true,
    modalTitle: 'Pettato',
    imagesLazyLoadPlaceholder: 'img/lazyload.jpg',
    imagesLazyLoadThreshold: 50,

});

// $$(document).on('pageAfterAnimation', function(e) { if (e.detail.page.name == "index" || e.detail.page.name == "login" || e.detail.page.name == "before_register" || e.detail.page.name == "shopper_register" || e.detail.page.name == "business_register" || e.detail.page.name == "forgot_password") { myApp.allowPanelOpen = false; } else { myApp.allowPanelOpen = true; } });

var mainView = myApp.addView('.view-main', {});

myApp.onPageInit('index', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
});

myApp.onPageInit('login', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
});

myApp.onPageInit('before_register', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
});

myApp.onPageInit('feeds', function(page) {
    myApp.allowPanelOpen = true;
    console.log('page.query.register:' + page.query.register);
    if (page.query.register) {
        // $('.tutorial').click(function(event) {
        //     $(this).hide();
        // });
    }
    bottom_tabs();
    load_feeds();
});

myApp.onPageInit('settings', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
});

myApp.onPageInit('profile_list', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
});

myApp.onPageInit('buzzs', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    load_buzzs_offers('buzz', '#buzzs-container');
});

myApp.onPageInit('offers', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    load_buzzs_offers('offer', '#offers-container');
});


myApp.onPageInit('feed', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    var feed_id = page.query.id;
    // load_feed(feed_id);
    // load_comments('feed', feed_id);
});

myApp.onPageInit('buzz', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    var buzz_id = page.query.id;
    load_buzz_offer('buzz', buzz_id);
    load_comments('buzz', buzz_id);
});

myApp.onPageInit('offer', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    var offer_id = page.query.id;
    load_buzz_offer('offer', offer_id);
    load_comments('offer', offer_id);
});

myApp.onPageInit('chats', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_chats();
});

myApp.onPageInit('chat', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    var reciever_id = page.query.id;
    load_chat(reciever_id);
});

myApp.onPageInit('notifications', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_notification();
});

myApp.onPageInit('create_feed', function(page) {
    myApp.allowPanelOpen = true;
    image_from_device = '';
    bottom_tabs();
    $('#create_feed-tags').materialtags('refresh');
    load_location_all('#create_feed-location');
});

myApp.onPageInit('create_buzz', function(page) {
    myApp.allowPanelOpen = true;
    image_from_device = '';
    bottom_tabs();
    $('#create_buzz-tags').materialtags('refresh');
    load_location_all('#create_buzz-location');
    load_category('#create_buzz-categories', function(){});
});

myApp.onPageInit('create_offer', function(page) {
    myApp.allowPanelOpen = true;
    image_from_device = '';
    bottom_tabs();
    $('#create_buzz-tags').materialtags('refresh');
    load_location_all('#create_buzz-location');
    load_category('#create_buzz-categories', function(){});
});


myApp.onPageInit('shopper_register', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    image_from_device = '';
    calendarDefault = myApp.calendar({
        input: '.calendar-default',
        maxDate: new Date(),
    });

    load_city('#shopper_register-city_select');

    $('#shopper_register-city_select').change(function(event) {
        var city_id = $(this).val();
        console.log('city_id: ' + city_id);
        load_location('#shopper_register-location_select', city_id, function(){});
    });

    var rightNow = new Date();
    console.log('rightNow: '+rightNow);
    var res = rightNow.toISOString().slice(0,10).replace(/-/g,"-");
    console.log('res: '+res);
    $('#shopper_register-dob').attr('max', res);
});

myApp.onPageInit('edit_profile_shopper', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_edit_profile_shopper();
});

myApp.onPageInit('business_register', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_city('#business_register-city_select');

    initialize();

    // $('#business_register-city_select').change(function(event) {
    //     var city_id = $(this).val();
    //     console.log('city_id: ' + city_id);
    //     load_location('#business_register-location_select', city_id, function(){});
    // });

    load_category('#business_register-category', function(){});
});

myApp.onPageInit('edit_profile_business', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_edit_profile_business();
});

myApp.onPageInit('profile_shopper', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    image_from_device = '';
    var user_id = token.id;
    $('.unfollow').hide();
    load_shopper_profile(user_id);
});

myApp.onPageInit('profile_business', function(page) {
    myApp.allowPanelOpen = true;
    bottom_tabs();
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    image_from_device = '';
    var user_id = token.id;
    $('.unfollow').hide();
    load_business_profile(user_id);
});

myApp.onPageInit('search', function(page) {
    myApp.allowPanelOpen = true;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
    load_search();
});


myApp.onPageInit('forgot_password', function(page) {
    myApp.allowPanelOpen = false;
    clearInterval(new_comment_interval);
    clearInterval(new_chat_interval);
});

myApp.onPageInit('people', function(page) {
    myApp.allowPanelOpen = true;
    console.log('pageInit: ' + j2s(page.query));
});

myApp.onPageInit('pets_list', function(page) {
    myApp.allowPanelOpen = true;
    load_pets_profiles();
});

myApp.onPageInit('business_list', function(page) {
    myApp.allowPanelOpen = true;
});

myApp.onPageInit('business_register_add', function(page) {
    myApp.allowPanelOpen = true;
});

myApp.onPageInit('pet_register', function(page) {
    myApp.allowPanelOpen = true;
    load_pet_categories();
    $("#pet_register-pettype").change(function(e) {
        e.preventDefault();
        if ($("#pet_register-pettype").val() == 'Select Pet Type') {
            myApp.alert("Please select the Pet Type");
        } else {
            load_breed_dropdown();
        }
    })
    // $("#pet_register-pettype").change(function(e){
    //     e.preventDefault();
    //     if (!$("#pet_register-pettype").val()) {
    //         myApp.alert("Please select the Pet Type");
    //     } else {
    //         load_breed_dropdown();
    //     }
    // })
});

myApp.onPageInit('profile_pet', function(page) {
    myApp.allowPanelOpen = true;
});




