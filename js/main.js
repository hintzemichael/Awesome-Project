/*
 * responsive-carousel ajax include extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

 /* -------------------------------------------------- 
   Table of Contents
-----------------------------------------------------
:: Carousel 
:: AJAX
:: Keyboard
:: Touch
:: Drag
*/

/* -----------------------------------------
   Carousel Script
----------------------------------------- */
(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		transitionAttr = "data-transition",
		transitioningClass = pluginName + "-transitioning",
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		inClass = pluginName + "-in",
		outClass = pluginName + "-out",
		navClass =  pluginName + "-nav",
		cssTransitionsSupport = (function(){
			var prefixes = "webkit Moz O Ms".split( " " ),
				supported = false,
				property;

			while( prefixes.length ){
				property = prefixes.shift() + "Transition";

				if ( property in document.documentElement.style !== undefined && property in document.documentElement.style !== false ) {
					supported = true;
					break;
				}
			}
			return supported;
		}()),
		methods = {
			_create: function(){
				$( this )
					.trigger( "beforecreate." + pluginName )
					[ pluginName ]( "_init" )
					[ pluginName ]( "_addNextPrev" )
					.trigger( "create." + pluginName );
			},
			
			_init: function(){
				var trans = $( this ).attr( transitionAttr );
				
				if( !trans ){
					cssTransitionsSupport = false;
				}
				
				return $( this )
					.addClass(
						pluginName + 
						" " + ( trans ? pluginName + "-" + trans : "" ) + " "
					)
					.children()
					.addClass( itemClass )
					.first()
					.addClass( activeClass );
			},
			
			next: function(){
				$( this )[ pluginName ]( "goTo", "+1" );
			},
			
			prev: function(){
				$( this )[ pluginName ]( "goTo", "-1" );
			},
			
			goTo: function( num ){
				
				var $self = $(this),
					trans = $self.attr( transitionAttr ),
					reverseClass = " " + pluginName + "-" + trans + "-reverse";
				
				// clean up children
				$( this ).find( "." + itemClass ).removeClass( [ outClass, inClass, reverseClass ].join( " " ) );
				
				var $from = $( this ).find( "." + activeClass ),
					prevs = $from.index(),
					activeNum = ( prevs < 0 ? 0 : prevs ) + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					$to = $( this ).find( ".carousel-item" ).eq( nextNum - 1 ),
					reverse = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : reverseClass;
				
				if( !$to.length ){
					$to = $( this ).find( "." + itemClass )[ reverse.length ? "last" : "first" ]();
				}

				if( cssTransitionsSupport ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverse );

				} else {
					$to.addClass( activeClass );
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverse );
				}
				
				var to_id=$to[0].getAttribute('id');
				console.log('to: '+to_id);
				getTraitsByPerson(to_id);
				// added to allow pagination to track
				$self.trigger( "goto." + pluginName, $to );
			},
			
			update: function(){
				$(this).children().not( "." + navClass ).addClass( itemClass );
				
				return $(this).trigger( "update." + pluginName );
			},
			
			_transitionStart: function( $from, $to, reverseClass ){
				var $self = $(this);
				
				$to.one( navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ? "webkitTransitionEnd" : "transitionend otransitionend", function(){
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass );
				});
				
				$(this).addClass( reverseClass );
				$from.addClass( outClass );
				$to.addClass( inClass );	
			},
			
			_transitionEnd: function( $from, $to, reverseClass ){
				$(this).removeClass( reverseClass );
				$from.removeClass( outClass + " " + activeClass );
				$to.removeClass( inClass ).addClass( activeClass );
			},
						
			_bindEventListeners: function(){
				var $elem = $( this )
					.bind( "click", function( e ){
						var targ = $( e.target ).closest( "a[href='#next'],a[href='#prev']" );
						if( targ.length ){
							$elem[ pluginName ]( targ.is( "[href='#next']" ) ? "next" : "prev" );
							e.preventDefault();
						}

					});
				
				return this;
			},
			
			_addNextPrev: function(){
				return $( this )
					.append( "<nav class='"+ navClass +"'><a href='#prev' class='prev' aria-hidden='true' title='Previous'>Prev</a><a href='#next' class='next' aria-hidden='true' title='Next'>Next</a></nav>" )
					[ pluginName ]( "_bindEventListeners" );
			},
			
			destroy: function(){
				// TODO
			}
		};
		
	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

			// if it's a method
			if( arrg && typeof( arrg ) === "string" ){
				return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
			}
			
			// don't re-init
			if( $( this ).data( pluginName + "data" ) ){
				return $( this );
			}
			
			// otherwise, init
			$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};
	
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods ); 
	
	// DOM-ready auto-init
	$( function(){
		$( initSelector )[ pluginName ]();
	} );

}(jQuery));

/* -----------------------------------------
   AJAX Script
----------------------------------------- */
(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName;
	
	// DOM-ready auto-init
	$( initSelector ).live( "ajaxInclude", function(){
		$( this )[ pluginName ]( "update" );
	} );
	
	// kick off ajaxIncs at dom ready
	$( function(){
		$( "[data-after],[data-before]", initSelector ).ajaxInclude();
	} );

}(jQuery));

/* -----------------------------------------
   Keyboard Script
----------------------------------------- */
(function($) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		navSelector = "." + pluginName + "-nav a",
		buffer,
		keyNav = function( e ) {
			clearTimeout( buffer );
			buffer = setTimeout(function() {
				var $carousel = $( e.target ).closest( initSelector );
				
				if( e.keyCode === 39 || e.keyCode === 40 ){ 
					$carousel[ pluginName ]( "next" );
				}
				else if( e.keyCode === 37 || e.keyCode === 38 ){
					$carousel[ pluginName ]( "prev" );
				}
			}, 200 );

			if( 37 <= e.keyCode <= 40 ) {
				e.preventDefault();
			}
		};

	// Touch handling
	$( navSelector )
		.live( "click", function( e ) {
			$( e.target )[ 0 ].focus();
		})
		.live( "keydown", keyNav );
}(jQuery));

/* -----------------------------------------
   Touch Script
----------------------------------------- */
(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		noTrans = pluginName + "-no-transition",
		// UA is needed to determine whether to return true or false during touchmove (only iOS handles true gracefully)
		iOS = /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
		touchMethods = {
			_dragBehavior: function(){
				var $self = $( this ),
					origin,
					data = {},
					xPerc,
					yPerc,
					setData = function( e ){
						
						var touches = e.touches || e.originalEvent.touches,
							$elem = $( e.target ).closest( initSelector );
						
						if( e.type === "touchstart" ){
							origin = { 
								x : touches[ 0 ].pageX,
								y: touches[ 0 ].pageY
							};
						}

						if( touches[ 0 ] && touches[ 0 ].pageX ){
							data.touches = touches;
							data.deltaX = touches[ 0 ].pageX - origin.x;
							data.deltaY = touches[ 0 ].pageY - origin.y;
							data.w = $elem.width();
							data.h = $elem.height();
							data.xPercent = data.deltaX / data.w;
							data.yPercent = data.deltaY / data.h;
							data.srcEvent = e;
						}

					},
					emitEvents = function( e ){
						setData( e );
						$( e.target ).closest( initSelector ).trigger( "drag" + e.type.split( "touch" )[ 1], data );
					};

				$( this )
					.bind( "touchstart", function( e ){
						$( this ).addClass( noTrans );
						emitEvents( e );
					} )
					.bind( "touchmove", function( e ){
						setData( e );
						emitEvents( e );
						if( !iOS ){
							e.preventDefault();
							window.scrollBy( 0, -data.deltaY );
						}					
					} )
					.bind( "touchend", function( e ){
						$( this ).removeClass( noTrans );
						emitEvents( e );
					} );
					
					
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, touchMethods ); 
	
	// DOM-ready auto-init
	$( initSelector ).live( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_dragBehavior" );
	} );

}(jQuery));

/* -----------------------------------------
   Drag Script
----------------------------------------- */
(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel, deltaX ){
			var $from = $carousel.find( "." + pluginName + "-active" ),
				activeNum = $from.prevAll().length + 1,
				forward = deltaX < 0,
				nextNum = activeNum + (forward ? 1 : -1),
				$to = $carousel.find( "." + itemClass ).eq( nextNum - 1 );
				
			if( !$to.length ){
				$to = $carousel.find( "." + itemClass )[ forward ? "first" : "last" ]();
			}
			
			return [ $from, $to ];
		};
		
	// Touch handling
	$( initSelector )
		.live( "dragmove", function( e, data ){

			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX );
			
			activeSlides[ 0 ].css( "left", data.deltaX + "px" );
			activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
		} )
		.live( "dragend", function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;
			
			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
			});			
				
			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
				activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );	
			}
		} );
		
}(jQuery));

/* Script to generate people.html
  <script type="text/javascript">
    var myJSONObject = {"bindings": 
    [{"PID":1,"image_url":"http://www.ischool.berkeley.edu/files/luisaguilar.jpg"},
{"PID":2,"image_url":"http://www.ischool.berkeley.edu/files/naila_alkhalawi.jpg"},
{"PID":3,"image_url":"http://www.ischool.berkeley.edu/files/divyaa.jpg"},
{"PID":4,"image_url":"http://www.ischool.berkeley.edu/files/andrea_angquist.jpg"},
{"PID":5,"image_url":"http://www.ischool.berkeley.edu/files/kay_ashaolu.jpg"},
{"PID":6,"image_url":"http://www.ischool.berkeley.edu/files/ryanbaker.jpg"},
{"PID":7,"image_url":"http://www.ischool.berkeley.edu/files/sophiebarness.jpg"},
{"PID":8,"image_url":"http://www.ischool.berkeley.edu/files/bobbell.jpg"},
{"PID":9,"image_url":"http://www.ischool.berkeley.edu/files/sebastianbenthall.jpg"},
{"PID":10,"image_url":"http://www.ischool.berkeley.edu/files/markbrazinski.jpg"},
{"PID":11,"image_url":"http://www.ischool.berkeley.edu/files/dsc_0407.jpg"},
{"PID":12,"image_url":"http://www.ischool.berkeley.edu/files/roofset.jpg"},
{"PID":13,"image_url":"http://www.ischool.berkeley.edu/files/sara_cambridge_.jpg"},
{"PID":14,"image_url":"http://www.ischool.berkeley.edu/files/natarajan_chakrapani.jpg"},
{"PID":15,"image_url":"http://www.ischool.berkeley.edu/files/kiran_c.jpg"},
{"PID":16,"image_url":"http://www.ischool.berkeley.edu/files/andrew_chao.jpg"},
{"PID":17,"image_url":"http://www.ischool.berkeley.edu/files/fredchasen.jpg"},
{"PID":18,"image_url":"http://www.ischool.berkeley.edu/files/arthur_che.jpg"},
{"PID":19,"image_url":"http://www.ischool.berkeley.edu/files/dsc01413_1.jpg"},
{"PID":20,"image_url":"http://www.ischool.berkeley.edu/files/img_0291-22_1.png"},
{"PID":21,"image_url":"http://www.ischool.berkeley.edu/files/rui_dai.jpg"},
{"PID":22,"image_url":"http://www.ischool.berkeley.edu/files/ishadandavate.jpg"},
{"PID":23,"image_url":"http://www.ischool.berkeley.edu/files/ashleydesouza.jpg"},
{"PID":24,"image_url":"http://www.ischool.berkeley.edu/files/laura_devendorf.jpg"},
{"PID":25,"image_url":"http://www.ischool.berkeley.edu/files/ajeetadhole.jpg"},
{"PID":26,"image_url":"http://www.ischool.berkeley.edu/files/npd-headshot.jpg"},
{"PID":27,"image_url":"http://www.ischool.berkeley.edu/files/dsc_9271_0.jpg"},
{"PID":28,"image_url":""},
{"PID":29,"image_url":"http://www.ischool.berkeley.edu/files/sydneyfriedman.jpg"},
{"PID":30,"image_url":"http://www.ischool.berkeley.edu/files/stuart_geiger.jpg"},
{"PID":31,"image_url":""},
{"PID":32,"image_url":"http://www.ischool.berkeley.edu/files/elizabethgoodman.jpg"},
{"PID":33,"image_url":"http://www.ischool.berkeley.edu/files/davidgreis.jpg"},
{"PID":34,"image_url":"http://www.ischool.berkeley.edu/files/bharathgunasekaran.jpg"},
{"PID":35,"image_url":"http://www.ischool.berkeley.edu/files/maxgutman.jpg"},
{"PID":36,"image_url":"http://www.ischool.berkeley.edu/files/jacobhartnell2.jpg"},
{"PID":37,"image_url":"http://www.ischool.berkeley.edu/files/sandrahelsley.jpg"},
{"PID":38,"image_url":"http://www.ischool.berkeley.edu/files/gilbert_hernandez.jpg"},
{"PID":39,"image_url":"http://www.ischool.berkeley.edu/files/michael_hintze.jpg"},
{"PID":40,"image_url":"http://www.ischool.berkeley.edu/files/katehsiao.jpg"},
{"PID":41,"image_url":"http://www.ischool.berkeley.edu/files/2687-9371_kao_bei_.jpg"},
{"PID":42,"image_url":"http://www.ischool.berkeley.edu/files/curtis_hwang.jpg"},
{"PID":43,"image_url":"http://www.ischool.berkeley.edu/files/coreyhyllested.jpg"},
{"PID":44,"image_url":"http://www.ischool.berkeley.edu/files/priyadarshiniiyer.jpg"},
{"PID":45,"image_url":"http://www.ischool.berkeley.edu/files/lisajervis.jpg"},
{"PID":46,"image_url":"http://www.ischool.berkeley.edu/files/carinne_johnson.jpg"},
{"PID":47,"image_url":"http://www.ischool.berkeley.edu/files/derekkan.jpg"},
{"PID":48,"image_url":"http://www.ischool.berkeley.edu/files/kuldeep_kapade.jpg"},
{"PID":49,"image_url":"http://www.ischool.berkeley.edu/files/pic_div.jpeg"},
{"PID":50,"image_url":"http://www.ischool.berkeley.edu/files/img_2430.jpg"},
{"PID":51,"image_url":"http://www.ischool.berkeley.edu/files/eung_chan_kim.jpg"},
{"PID":52,"image_url":"http://www.ischool.berkeley.edu/files/naehee_kim.jpg"},
{"PID":53,"image_url":"http://www.ischool.berkeley.edu/files/jenking_dec2010.jpg"},
{"PID":54,"image_url":"http://www.ischool.berkeley.edu/files/vimal_kini_.jpg"},
{"PID":55,"image_url":"http://www.ischool.berkeley.edu/files/juliakoshelevacoats.jpg"},
{"PID":56,"image_url":"http://www.ischool.berkeley.edu/files/headshot_1.jpg"},
{"PID":57,"image_url":"http://www.ischool.berkeley.edu/files/taeil_kwak.jpg"},
{"PID":58,"image_url":"http://www.ischool.berkeley.edu/files/jentonlee.jpg"},
{"PID":59,"image_url":"http://www.ischool.berkeley.edu/files/davelester.jpg"},
{"PID":60,"image_url":""},
{"PID":61,"image_url":"http://www.ischool.berkeley.edu/files/deblinton.jpg"},
{"PID":62,"image_url":"http://www.ischool.berkeley.edu/files/yiming_liu.jpg"},
{"PID":63,"image_url":"http://www.ischool.berkeley.edu/files/colinmacarthur.jpg"},
{"PID":64,"image_url":"http://www.ischool.berkeley.edu/files/scottmartin.jpg"},
{"PID":65,"image_url":"http://www.ischool.berkeley.edu/files/ashwin_mathew_.jpg"},
{"PID":66,"image_url":"http://www.ischool.berkeley.edu/files/2.png"},
{"PID":67,"image_url":"http://www.ischool.berkeley.edu/files/ryan_mcadam.jpg"},
{"PID":68,"image_url":"http://www.ischool.berkeley.edu/files/vanessamcafee.jpg"},
{"PID":69,"image_url":"http://www.ischool.berkeley.edu/files/suhani_mehta.jpg"},
{"PID":70,"image_url":"http://www.ischool.berkeley.edu/files/mary_morshed.jpg"},
{"PID":71,"image_url":"http://www.ischool.berkeley.edu/files/sayantanmukhopadhyay.jpg"},
{"PID":72,"image_url":"http://www.ischool.berkeley.edu/files/brianmurphy.jpg"},
{"PID":73,"image_url":"http://www.ischool.berkeley.edu/files/elliot_nahman.jpg"},
{"PID":74,"image_url":"http://www.ischool.berkeley.edu/files/meena_natarajan.jpg"},
{"PID":75,"image_url":"http://www.ischool.berkeley.edu/files/peternguyen.jpg"},
{"PID":76,"image_url":""},
{"PID":77,"image_url":"http://www.ischool.berkeley.edu/files/galen_panger.jpg"},
{"PID":78,"image_url":"http://www.ischool.berkeley.edu/files/kyungmipark.jpg"},
{"PID":79,"image_url":"http://www.ischool.berkeley.edu/files/haroonrasheedpaulmohamed.jpg"},
{"PID":80,"image_url":"http://www.ischool.berkeley.edu/files/ignacioperez.jpg"},
{"PID":81,"image_url":"http://www.ischool.berkeley.edu/files/christinapham.jpg"},
{"PID":82,"image_url":"http://www.ischool.berkeley.edu/files/jacob_portnoff_0.jpg"},
{"PID":83,"image_url":"http://www.ischool.berkeley.edu/files/seemaputhyapurayil.jpg"},
{"PID":84,"image_url":"http://www.ischool.berkeley.edu/files/bryan_rea.jpg"},
{"PID":85,"image_url":"http://www.ischool.berkeley.edu/files/ajrenold.jpg"},
{"PID":86,"image_url":"http://www.ischool.berkeley.edu/files/danielarosner.jpg"},
{"PID":87,"image_url":"http://www.ischool.berkeley.edu/files/katerushton.jpg"},
{"PID":88,"image_url":"http://www.ischool.berkeley.edu/files/rohansalantry.jpg"},
{"PID":89,"image_url":"http://www.ischool.berkeley.edu/files/masanorisasaki.jpg"},
{"PID":90,"image_url":"http://www.ischool.berkeley.edu/files/arianshams.jpg"},
{"PID":91,"image_url":"http://www.ischool.berkeley.edu/files/gregory_shapiro.jpg"},
{"PID":92,"image_url":"http://www.ischool.berkeley.edu/files/sonalisharma.jpg"},
{"PID":93,"image_url":"http://www.ischool.berkeley.edu/files/gaurav_shetti.jpg"},
{"PID":94,"image_url":"http://www.ischool.berkeley.edu/files/shreyas.jpg"},
{"PID":95,"image_url":"http://www.ischool.berkeley.edu/files/christosims.jpg"},
{"PID":96,"image_url":"http://www.ischool.berkeley.edu/files/victorstarostenko.jpg"},
{"PID":97,"image_url":"http://www.ischool.berkeley.edu/files/lazarstojkovic.jpg"},
{"PID":98,"image_url":"http://www.ischool.berkeley.edu/files/tim_stutt.jpg"},
{"PID":99,"image_url":"http://www.ischool.berkeley.edu/files/dsc_8901_0.jpg"},
{"PID":100,"image_url":"http://www.ischool.berkeley.edu/files/sam_tokheim.jpg"},
{"PID":101,"image_url":"http://www.ischool.berkeley.edu/files/adriane_urband.jpg"},
{"PID":102,"image_url":"http://www.ischool.berkeley.edu/files/karthik_reddy_vadde.jpg"},
{"PID":103,"image_url":"http://www.ischool.berkeley.edu/files/Sarah_Van_Wart.jpg"},
{"PID":104,"image_url":"http://www.ischool.berkeley.edu/files/Rajesh_Veeraraghavan.jpg"},
{"PID":105,"image_url":"http://www.ischool.berkeley.edu/files/tvv.jpg"},
{"PID":106,"image_url":"http://www.ischool.berkeley.edu/files/morganwallace.jpg"},
{"PID":107,"image_url":"http://www.ischool.berkeley.edu/files/alice_wang.jpg"},
{"PID":108,"image_url":"http://www.ischool.berkeley.edu/files/charleswang.jpg"},
{"PID":109,"image_url":"http://www.ischool.berkeley.edu/files/jennifer_wang.jpg"},
{"PID":110,"image_url":"http://www.ischool.berkeley.edu/files/andrewwin.jpg"},
{"PID":111,"image_url":"http://www.ischool.berkeley.edu/files/laura_wishingrad.jpg"},
{"PID":112,"image_url":"http://www.ischool.berkeley.edu/files/wendyxue.jpg"},
{"PID":113,"image_url":"http://www.ischool.berkeley.edu/files/aijia_yan.jpg"},
{"PID":114,"image_url":"http://www.ischool.berkeley.edu/files/ericzan.jpg"},
{"PID":115,"image_url":"http://www.ischool.berkeley.edu/files/quianquian_zhao.jpg"}]
};

console.log(myJSONObject.bindings[0].PID)

  jQuery.each(myJSONObject.bindings, function(i, k) {
      
    });

  jQuery(document).ready(function()
  {
    jQuery.each(myJSONObject.bindings, function(i, k) {
    jQuery('.holder')

    .append('<div id="'+myJSONObject.bindings[i].PID+'"'+'class="carousel-item">'+'<img src="'+myJSONObject.bindings[i].image_url+'"></div>');
    });

  });
  </script>
  */

