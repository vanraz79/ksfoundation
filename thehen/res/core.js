$(document).ready(
	function()
	{
		// on the product page, highlight the first product thumbnail
		$(".product-images a:first").addClass("active");

		// add the hover effect on the product thumbnails
		$(".product-images a").click(
			function() {
				// on mouse enter
				$(".product-images a.active").removeClass("active");
				$(this).addClass("active");

				// update the main image
				var thumb_src = $("img:first", $(this)).attr("src");
				thumb_src = thumb_src.replace(/width=(\d+)&height=(\d+)/g, 'width=460&height=460');
				$(".product-information .image img").attr("src", thumb_src);
			}
		);

		$('.carousel').carousel({
			interval: 4000
		});
	}
);
