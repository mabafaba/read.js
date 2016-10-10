
function initHover(){
	$(".snip").hover(
  function () {
  	$('.snip').removeClass('hover');
    $(this).addClass('hover');

  }, 
  function () {
    $(this).removeClass('hover');

  }
);

}

// function divCursor(){
// $(body).append("<div id='cursorDiv'>");

// $(document).on('mousemove', function(e){
//     $('#your_div_id').css({
//        left:  e.pageX,
//        top:   e.pageY
//     });
// });

// }
function hw_init(source,div){
$.getJSON(source, function(allsnips) {
		rendersnip(allsnips,div,0)
		finalize();
		console.log(source);
	});
$("#snip-"+div).append("<div style='color:grey;font-size:10px;padding-left:75%;margin-top:25px;bottom:0px;position:absolute;width:100%;'><a href='http://www.martinbarner.de/projects.php?id=19' target='_blank'>+ - read.js (Martin B.)</div>");
}


function finalize(){
			jQuery(".snip.level0").removeClass("hidden");
			jQuery(".snip.level1").removeClass("hidden");
			$(".snip-collapse").addClass("snip-button-hidden");
			$(".snip.level0").children(".snip-button").remove();
			// initHover();

}


function expandButtons(id,expandSymbol,contractSymbol){

jQuery(id).prepend(
	  "<div class='snip-button snip-expand'>"+ expandSymbol + "</div>"
	+ "<div class='snip-button snip-collapse'>"+ contractSymbol + "</div>"

	);


}



function hideOnClick(id){
	jQuery(id).click(function(e){
		if(!jQuery(this).children().hasClass("hidden")){
			collapseSnip(this);
		}else{
	expandSnip(this);
			}
		e.stopPropagation(); 
	});
	jQuery(".snip.level0").unbind();
}


function collapseSnip(snip){
			console.log("collapsing..")
			jQuery(snip).addClass("collapsed");
			jQuery(snip).removeClass("expanded");

			jQuery("div.has_children",snip).addClass("collapsed");
			jQuery("div.has_children",snip).removeClass("expanded");

			jQuery("div", snip).addClass("hidden");
			jQuery(".snip-expand",snip).removeClass("snip-button-hidden");
			jQuery(".snip-collapse",snip).addClass("snip-button-hidden");
			jQuery(".snip-expand",snip).removeClass("snip-button-hidden");
			jQuery(".snip-collapse",snip).addClass("snip-button-hidden");

			jQuery(".snip-expand",snip).removeClass("hidden");
			jQuery(".snip-collapse",snip).removeClass("hidden");



}

function expandSnip(snip){
			console.log("expanding..");
			$(snip).removeClass("collapsed");
			$(snip).addClass("expanded");
			jQuery(snip).children().removeClass("hidden");
			jQuery(snip).children(".snip-expand").addClass("snip-button-hidden");
			jQuery(snip).children(".snip-collapse").removeClass("snip-button-hidden");
}

function expandAll(snip){
			console.log("expanding..")
			jQuery("div", snip).removeClass("collapsed");
			jQuery("div", snip).addClass("expanded");
			jQuery("div", snip).removeClass("hidden");
			jQuery(".snip-expand",snip).addClass("snip-button-hidden");
			jQuery(".snip-collapse",snip).removeClass("snip-button-hidden");	
}



	function rendersnip(snip,parentid,level){
		if(!level){
		var level = 0;
		}

		var thisid = parentid;
		for(var i = 0; i<snip.length;i++){

			// CASE STRING:
			if (typeof snip[i]  === 'string' || snip[0]  instanceof String){
				thisid = "" + parentid+ "-" + i;
				var pre = "<div class='snip hidden no_children level" + level + "' id='snip-"+ thisid + "'>";
				var post = "</div>";
				var full  = pre + snip[i] + post;
				if($("#snip-"+parentid).length<1){
					console.log("cannot append <br> " +full+ "<br> to div id " + "#snip" + parentid);
				}
				$('#snip-'+parentid).append(full);
			}
			// CASE ARRAY
			else if(snip[i].constructor === Array){
				$("#snip-" + thisid).removeClass("no_children");
				$("#snip-" + thisid).addClass("has_children");
				expandButtons("#snip-" + thisid,'+','-');
				hideOnClick("#snip-" + thisid);
				rendersnip(snip[i],thisid,level+1);

			}
			 // CASE OBJECT
		else if($.isPlainObject(snip[i])){
			switch (snip[i].type) {

					case "include":
						console.log("INCLUDE in " + thisid +" a new div ");
						$("#snip-" + thisid).removeClass("no_childrens");
						$("#snip-" + thisid).addClass("has_childrens");
						console.log($('#snip-'+thisid).length);

						$.getJSON(snip[i].source, function(includesnips) {
							console.log("INCLUDING DATA LOADED");
						rendersnip(includesnips,thisid,level);

						});
						break;	


				 case "link":
					thisid = "" + parentid+ "-" + i;
					var full =     
								"<div class='snip link hidden no_children"
								+ " level" + level + "' id='snip-"+ thisid + "'>"
								+"<a href='" +snip[i].href
								+ "' target='_blank'>"
								+ snip[i].text
								+"</a>"
								+"</div>";
					// var full ="hello";
					console.log(full);

					// var full  = pre + snip[i] + post;
					console.log(parentid);
					$('#snip-'+parentid).append(full);
					break;

				 case "image":
				 	thisid = "" + parentid+ "-" + i;
					var full =   
								"<div class='snip image hidden no_children"
								+ " level" + level + "' id='snip-"+ thisid +"'"
								+ " style='" + snip[i].style + "'"
								+ ">"
								+"<img class='snip-image' src='" +snip[i].src
								// + "' alt='" + (snip[i].alt)? snip[i].alt : ""
								+"'>"
								+"</div>";
					// var full ="hello";
					console.log(full);

					// var full  = pre + snip[i] + post;
					console.log(parentid);
					$('#snip-'+parentid).append(full);
					break;

				 	break;




			}
			if('child' in snip[i]){
				$("#snip-" + thisid).removeClass("no_children");
				$("#snip-" + thisid).addClass("has_children");
				expandButtons("#snip-" + thisid,'+','-');
				hideOnClick("#snip-" + thisid);
				rendersnip(snip[i].child,thisid,level+1);

			}
			if('class' in snip[i]){
				$("#snip-" + thisid).addClass(snip[i].class)
			}
		}
	}
finalize();
}






// [
//     "Cities and Social networks",
//     [ 

		
// 			"built Cities are, at least partially, physical infrastructure to facilitate social networks."
// 			,["asdslf lsadjls", " asdlfadsf", "adslkfjdsalfk"]
// 			,"What cities built from scratch, like Brazilia or masdar, have in common is that they start out with a physical structure alone - empty buildings without residents. Then they try to attract people to live there, who then should form a sustainable social network of collaborative, economical, educational and personal relationships."
// 			,"Why not turn this approach upside down: first, grow a community of people who are potentially willing to move to a new city. Then built the physical city with them, for them."
// 				,[
// 				"Potential benefits -"
// 				,"This is useful because: "
// 					,[
// 						"building an empty city is a blind game; you don't know who you are building it for, you have no interaction with the potential users of your product.'"
// 						,"reason2"
// 					]
// 				]
// 			,"adsf"
// 			,"saddfsfasadfs"

//  	]
//  ]
 

