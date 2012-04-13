var isInLittleMode = true;
var slideTime = 300;
var SPACE_KEEPER = '<div class="spaceKeeper" style="height: 40px; ' + 
'width: 1px; border: 0px solid white"></div>';

var lastRessource = 'welcome';

$(document).ready(function() {
    
    
    //$('#slider h1').append('<a class="tiny" href="#top">top</a>');
    //$('a.scrollMark').prepend(SPACE_KEEPER);
    
    
    
    function goInLittleMode(top) {
        var shallBeSmall = (top > 50);
        
        if(shallBeSmall != isInLittleMode) {
            
            var prefix = (isInLittleMode ? ("+") : ("-"));
            
            $("#header").animate({ 
                paddingBottom: (prefix + "=25px")
            }, slideTime);
            
            
            $("#header").animate({ 
                marginTop: (prefix + "=65px")
            }, slideTime);
        
            isInLittleMode = !isInLittleMode;
        }
    }
    
    function setHeadingTopNaviInitial() {
        var helpSlideTime = slideTime;
        slideTime = 1;
        
        goInLittleMode($(document).scrollTop());
        
        slideTime = helpSlideTime;
    }
    
    

    
    //setHeadingTopNaviInitial();
    $('a.scrollMark').append('<span class="hidden"></span>');
    
    /*
    $(document).scroll(function(){
        goInLittleMode($(document).scrollTop());
    });
    */
    
    
    // slide effect
    
    
    // bind the navigation clicks to update the selected nav:
    $('#slider #page #page_position_content #header').find('.topNavi').find('p')
    .find('a').click(selectNav);

    // handle nav selection - lots of nice chaining :-)
    function selectNav() {
        trigger({
            id : this.hash.substr(1)
        });
        e.preventDefault();
    }

    function trigger(data) {          
        
        $('.scroll .scrollContainer .section').hide();
        
        lastRessource = ressource;
        
        
        var ressource = getMappingNameForHash(data.id);
        if(ressource == null)
            ressource = 'welcomeText';
        $('#' + ressource).show();
        
        var newTitle = 'OpenPythia';
        if(ressource != 'welcomeText')
            newTitle += ' > ' + $('#' + ressource).find('h1').html();
        
        document.title = newTitle;
        
        //$('.topNavi p #ln' + ressource).css('color', 'green');
        
        $('.spaceKeeper').remove();
        $('#' + ressource).prepend(SPACE_KEEPER);
    }
    
    if ("onhashchange" in window) {
        $(window).bind('hashchange', function(e) {
            trigger({
                id : window.location.hash.substr(1)
            });
        });
    }

    
    function getMappingNameForHash(quest) {
        switch(quest) {
            case 'welcome':
                return 'welcomeText';
            case 'top':
                return 'top';
            case 'run':
                return 'run';
            case 'pros':
                return 'pros';
            case 'spread':
                return 'spread';
            case 'info':
                return 'info';
        }
        
        return null;
    }
    
    
    
    if (window.location.hash) {
        trigger({
            id : window.location.hash.substr(1)
        });
    }
    else {
        trigger({
            id : lastRessource
        });
    }

    // end slide effect


    // manual images
    $('img.manualthumb').each(function(){
        $(this).load(function() {
            $(this).width($(this).width() * 0.5);
        });
    });
    
    $('#selectIDE').show();
    // changedIDE();
    
    $(document).ready(function(){
        $('#eclipseIDE').click( function() {
            changedIDE();
        });
        $('#netbeansIDE').click( function() {
            changedIDE();
        });
    });
    
    function changedIDE() {
        
        $('.ec').hide();
        $('.nb').hide();
        
            
        if ($('#eclipseIDE:checked').val() == 'eclipseIDE') {
            $('.ec').show();
        }
        
        if ($('#netbeansIDE:checked').val() == 'netbeansIDE') {
            $('.nb').show();
        }
    }
    
    changedIDE();

    
    
// end of manual images


});