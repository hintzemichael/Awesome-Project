/* -------------------------------------------------- 
   Table of Contents
-----------------------------------------------------
:: Carousel 
*/

/* -----------------------------------------
   Carousel Script
----------------------------------------- */
/* Tiny Carousel 
http://baijs.nl/tinycarousel/
*/

(function (a) {
    a.tiny = a.tiny || {};
    a.tiny.carousel = {
        options: {
            start: 1,
            display: 1,
            axis: "x",
            controls: true,
            pager: false,
            interval: false,
            intervaltime: 3000,
            rewind: false,
            animation: true,
            duration: 1000,
            callback: null
        }
    };
    a.fn.tinycarousel_start = function () {
        a(this).data("tcl").start()
    };
    a.fn.tinycarousel_stop = function () {
        a(this).data("tcl").stop()
    };
    a.fn.tinycarousel_move = function (c) {
        a(this).data("tcl").move(c - 1, true)
    };
 
    function b(q, e) {
        var i = this,
            h = a(".viewport:first", q),
            g = a(".overview:first", q),
            k = g.children(),
            f = a(".next:first", q),
            d = a(".prev:first", q),
            l = a(".pager:first", q),
            w = 0,
            u = 0,
            p = 0,
            j = undefined,
            o = false,
            n = true,
            s = e.axis === "x";
 
        function m() {
            if (e.controls) {
                d.toggleClass("disable", p <= 0);
                f.toggleClass("disable", !(p + 1 < u))
            }
            if (e.pager) {
                var x = a(".pagenum", l);
                x.removeClass("active");
                a(x[p]).addClass("active")
            }
        }
        function v(x) {
            if (a(this).hasClass("pagenum")) {
                i.move(parseInt(this.rel, 10), true)
            }
            return false
        }
        function t() {
            if (e.interval && !o) {
                clearTimeout(j);
                j = setTimeout(function () {
                    p = p + 1 === u ? -1 : p;
                    n = p + 1 === u ? false : p === 0 ? true : n;
                    i.move(n ? 1 : -1)
                }, e.intervaltime)
            }
        }
        function r() {
            if (e.controls && d.length > 0 && f.length > 0) {
                d.click(function () {
                    i.move(-1);
                    return false
                });
                f.click(function () {
                    i.move(1);
                    return false
                })
            }
            if (e.interval) {
                q.hover(i.stop, i.start)
            }
            if (e.pager && l.length > 0) {
                a("a", l).click(v)
            }
        }
        this.stop = function () {
            clearTimeout(j);
            o = true
        };
        this.start = function () {
            o = false;
            t()
        };
        this.move = function (y, z) {
            p = z ? y : p += y;
            if (p > -1 && p < u) {
                var x = {};
                x[s ? "left" : "top"] = -(p * (w * e.display));
                g.animate(x, {
                    queue: false,
                    duration: e.animation ? e.duration : 0,
                    complete: function () {
                        if (typeof e.callback === "function") {
                            e.callback.call(this, k[p], p)
                        }
                    }
                });
                m();
                t()
            }
        };
 
        function c() {
            w = s ? a(k[0]).outerWidth(true) : a(k[0]).outerHeight(true);
            var x = Math.ceil(((s ? h.outerWidth() : h.outerHeight()) / (w * e.display)) - 1);
            u = Math.max(1, Math.ceil(k.length / e.display) - x);
            p = Math.min(u, Math.max(1, e.start)) - 2;
            g.css(s ? "width" : "height", (w * k.length));
            i.move(1);
            r();
            return i
        }
        return c()
    }
    a.fn.tinycarousel = function (d) {
        var c = a.extend({}, a.tiny.carousel.options, d);
        this.each(function () {
            a(this).data("tcl", new b(a(this), c))
        });
        return this
    }
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

