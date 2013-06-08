$(document).ready(function(){

	var
		//DOM Elements
		win = $(window),
		pageWrapper = $('#page-wrapper'),
		indexBg = $('#index-bg'),
		header = $('#header'),
		contentWrap = $('#content-wrap'),
		content = $('#content'),
		galleryNav = $('#gallery-nav'),
		galleryFrame = $('#gallery-frame'),
		galleryImageWrap = $('.gallery-image'),
		galleryWrap = $('#gallery-wrap'),
		galleryNavWrap = $('#gallery-nav-wrap'),
		galleryImage = galleryWrap.find('img'),
		needsFixin = [
			pageWrapper,
			galleryNavWrap
		],
		imageWidth = galleryImage.width(),
		imageHeight,
		proportion,

		theGallery,

		//HISTORY
		history = window.History,
		state = history.getState(),
		urlSplit = state.url.split('/'), 

		//Methods

		setState = function(){

		  if (urlSplit.length < 5){
		  	indexBg.css('display', 'block');
		  }

			if (urlSplit.length > 3){
				currentMenu = $('#' + urlSplit[3]);
				currentMenu.css('display', 'block');
				if (urlSplit[3] === 'photography' && urlSplit.length >= 5){
					galleryNavWrap.css('visibility', 'visible');
				}
			}

			if (urlSplit.length >= 5){
				indexBg.css('display', 'none');
			}
		},

		verticalPosition = function(obj){
			
			var 
				winHalf = Math.floor(win.height() / 2),
				objHalf = Math.floor(obj.height() / 2),
				position = winHalf - objHalf;

			obj.css('margin-top', position);

		},

		setImageProps = function(initial){

			console.log('being called');
			var
				winWidth = win.width(),
				winHeight = win.height() - (1 * header.outerHeight(true)),
				width,
				firstImage = galleryImage.first(),
				timer;



			galleryImage.css('width', winWidth);
			timer = setInterval(function(){
				var height = firstImage.height();
				if (height > 0){
					clearInterval(timer);
					timer = null;
	
					imageHeight = height;
					imageWidth = firstImage.width();

					//Get Proportions
					proportion = imageWidth / imageHeight;
					width = winHeight * proportion;

					if (imageHeight > winHeight){
						
						galleryImage.css('width', '100%');
						galleryImageWrap.css({
							'height': winHeight,
							'width': width
						});
					}

					galleryFrame.css({
						'height': winHeight,
						'width': winWidth
					})

					galleryWrap.css({
						'height': winHeight,
						'width':  (width * galleryImage.length) + width
					});

					galleryWrap.css('visibility', 'visible');

					if (initial){
						theGallery = createGallery();
					} else {
						theGallery.setWidth(width);
						galleryWrap.css('visibility', 'visible');
					}

				}
			}, 10);
		},

		setContent = function(){

			var width = win.width();
			content.css('width', width - 9);
			contentWrap.css('width', width);

		},

		setHeights = function(obj){

			$.each(obj, function(i,v){
				v.css('height', win.height());
			});

		},

		gallery = function(){
  
		  var 
		  	that = {},
		  	buttons = {},

		  	images = galleryImageWrap,
		  	firstImage = images.slice(0,1),
		  	queued = images.slice(1,2), //queue second image at start

		  	imageWidth = firstImage.width(),
		  	position = 1,
		  	distance = 0,
		  	current = position,
		  	total = galleryImage.length,

		  	//Private Methods
		  	fixCount = function(count){  
		    	var fixed;
		      if ( count < 10 ){
		        fixed = '00' + count; 
			    } else {
			      fixed = '' + count; 
			    }
			    return fixed;
		  	},

		  	checkPosition = function(position){

			    if (position == total){
			      buttons.next.addClass('hidden');
			    } else {
				    buttons.next.removeClass('hidden'); 
			    }

			    if (position == 1){
			    	buttons.prev.addClass('hidden');
			    } else {
			    	buttons.prev.removeClass('hidden'); 
			    }

			  };

			that.setWidth = function(newWidth){

				imageWidth = newWidth;
				that.setDistance();
			}

	 		that.setDistance = function(){
	 			distance = -1 * ((position - 1) * imageWidth);
	 			galleryWrap.css({
		    	left: distance
		    });
			}

			that.moveGallery = function(direction){

		    var
		      currentImage,
		      currentZ,
		      newPosition,
		      newImage,
		      previousImage;

		      currentImage = images.slice(position - 1, position);
	        currentImage.css({
	          'opacity': 1
	        });

		      if ( direction === 'left' ){
		        newPosition = position - 1;
		        position = newPosition;
		        distance = distance + imageWidth;
		        newImage = currentImage.prev();
		      } else {
		        newPosition = position + 1;
		        position = newPosition;
		        distance = distance - imageWidth;
		        newImage = currentImage.next();
		      }

		      galleryWrap.animate({
		      	left: distance
		      }, 1500);

		      newImage.animate({
		        opacity: 1
		      }, 700);

		      currentImage.animate({
		        opacity: 0.1
		      }, 700);

		    checkPosition(newPosition);

		  }//movegallery

		  //buttons
		 
		  buttons.next = $('#next');
		  buttons.prev = $('#prev');

		   //initialize

		  checkPosition(1);
		  
		  //methods
		  
		  (function(){
		  	firstImage.css({
		  		'opacity': 1
		  	});
		  	buttons.next.click(function(){
		  		that.moveGallery('right');
		  	});
		  	buttons.prev.click(function(){
		  		that.moveGallery('left');
		  	});
		  })();

	  	return that;

		},// Gallery constructor

		createGallery = function(){
			var that = gallery();
			return that;
		},

   eventStop = (function () {
      var timers = {};
      return function (callback, ms, uniqueId) {
        if (!uniqueId) {
          uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })(), 

		initializePage = function(initial){
			setHeights(needsFixin);
			verticalPosition(galleryNav);
			setImageProps(initial);
			setContent();

			if (initial){
				setState();
			}
		};

	initializePage(true);

	setTimeout(function(){
	}, 2000);

	win.resize(function(){
		galleryWrap.css('visibility', 'hidden');
		eventStop(function(){
			initializePage();
		}, 500, 'tester');
	});

});
