/**
* Generates a new nonce on page load via AJAX
* Solves problem of cached pages and expired nonces
*
* Events:
* favorites-nonce-generated: The nonce has been generated
*/
var Favorites = Favorites || {};

Favorites.NonceGenerator = function()
{
	var plugin = this;
	var $ = jQuery;

	plugin.bindEvents = function()
	{
		$(document).ready(function(){
			if ( Favorites.jsData.dev_mode ){
				console.log('Favorites Localized Data');
				console.log(Favorites.jsData);
			}
			plugin.getNonce();
		});
	}

	/**
	* Make the AJAX call to get the nonce
	*/
	plugin.getNonce = function()
	{
		if ( Favorites.jsData.cache_enabled === '' ){
			Favorites.jsData.nonce = favorites_data.nonce;
			return;
		}

		if ( Favorites.jsData.ajax_type === 'wp_api' ){
			var url = Favorites.api_endpoints.nonce;
			var type = 'GET';
			var data = {};
		} else {
			var url = Favorites.jsData.ajaxurl;
			var type = 'POST';
			var data = {
				action : Favorites.formActions.nonce
			}
		}
		
		$.ajax({
			url: url,
			type: type,
			datatype: 'json',
			data: data,
			success: function(data){
				Favorites.jsData.nonce = data.nonce;
				if ( Favorites.jsData.dev_mode ){
					console.log('Nonce successfully generated: ' + data.nonce);
				}
				$(document).trigger('favorites-nonce-generated', [data.nonce]);
			}
		});
	}

	return plugin.bindEvents();
}