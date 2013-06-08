$(document).ready(function(){

	var
		//DOM Elements
		win = $(window),
		pageWrapper = $('#page-wrapper'),
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

		currentMenu,

		//HISTORY
		history = window.History,
		state = history.getState(),
		urlSplit = state.url.split('/');

		History.Adapter.bind(window, 'statechange', function() {
	  });

		if (urlSplit.length > 3){
			currentMenu = $('#' + urlSplit[3]);
			currentMenu.css('display', 'block');
			if (urlSplit[3] === 'photography' && urlSplit.length >= 5){
				galleryNavWrap.css('visibility', 'visible');
			}
		}

		//Methods
		verticalPosition = function(obj){
			
			var 
				winHalf = Math.floor(win.height() / 2),
				objHalf = Math.floor(obj.height() / 2),
				position = winHalf - objHalf;

			obj.css('margin-top', position);

		},

		setImageProps = function(initial){
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

					createGallery();

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

		  	width = firstImage.width(),
		  	distance = 0,
		  	position = 1,
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

			  console.log('gallery-width' + width);

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
		        distance = distance + width;
		        newImage = currentImage.prev();
		      } else {
		        newPosition = position + 1;
		        position = newPosition;
		        distance = distance - width;
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
		}

		initializePage = function(initial){
			setHeights(needsFixin);
			verticalPosition(galleryNav);
			setImageProps(initial);
			setContent();
		};

	initializePage(true);

	win.resize(function(){
		galleryWrap.css('visibility', 'hidden');
		initializePage();
	});

});
