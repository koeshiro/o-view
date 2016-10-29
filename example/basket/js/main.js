(function(){
	//Not standart border
	/*var e=document.querySelectorAll('.border-content'),i=0,n=e.length;
	while(i<n){
		var width=e[i].offsetWidth,parentWidth=e[i].parentNode.offsetWidth,borderWidth=Math.floor(((parentWidth-width)/2)-2);
		console.log(width,parentWidth,borderWidth,(parentWidth-width));
		e[i].parentNode.querySelector('.left-border').style.width=borderWidth+'px';e[i].parentNode.querySelector('.right-border').style.width=borderWidth+'px';
		i++;
	}*/
	$('.spoiler .info').hide();
	$('.spoiler .open').click(function(){
		$(this).hide();
		$(this).parent().children('.info').show();
		$(this).parent().children('.closed').show();
	});
	$('.spoiler .closed').click(function(){
		$(this).hide();
		$(this).parent().children('.info').hide();
		$(this).parent().children('.open').show();
	});
})()
