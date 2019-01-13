(function(global, factory) {
	if (typeof global.d3 !== 'object' || typeof global.d3.version !== 'string')
		throw new Error('tables requires d3v4');
	var v = global.d3.version.split('.');
	if (v[0] != '4')
		throw new Error('tables requires d3v4');
	if (typeof global.bs !== 'object' || typeof global.bs.version !== 'string')
		throw new Error('tables require d3-Bootstrap');
	factory(global.r = global.r || {}, d3, global);
})(this, (function(repo, d3, global) {
	var ingredients = {};
	var materiels = {};
	var recettes = {};
	var obj = {};

	r.ingredient	= function(name, data) {
		ingredients[name] = data;
		ingredients[name]['used'] = Array();
	}
	r.materiel	= function(name, data) {
		materiels[name] = data;
		materiels[name]['used'] = Array();
	}
	r.recette	= function(name, data) {
		recettes[name] = data;
		recettes[name]['etapes'] = recettes[name]['etapes'] || [];
		for (var k in data['ingredients']) {
			ingredients[k]['used'].push(name);
		}
		data['materiels'].forEach(function(k) {
			materiels[k]['used'].push(name);
		});
	}

	obj.ing_item	= function(id) {
		var id=id;
		function chart(s) { s.each(chart.init); return chart; }
		chart.init	= function() { 
			var root= d3.select(this).append('a')
				.html(ingredients[id]['nom'])
				.attr('data-toggle','modal').attr('data-target', '#ing-'+id).on('click.bs.modal.data-api',		bs.api.modal.click);
			return chart;
		};
		return chart;
	}
	obj.ing_modal	= function(id) {
		var l =  bs.list();
		ingredients[id]['used'].forEach(function(k) {
			l.add(obj.rec_item(k));
		});
		var chart = bs.modal().id('ing-'+id).title(ingredients[id]['nom']).body(
			bs.union().item(bs.desc()
				.item('Nom', ingredients[id]['nom'])
				.item('Prix au '+ingredients[id]['unite_achat'], ingredients[id]['prix']+' €'))
			.item(bs.p('Utilisé dans les recettes suivantes :'))
			.item(l));
		return chart;
	}
	obj.ing_table = function () {
		var items = [];
		function chart(s) { s.each(chart.init); return chart; }
		chart.data	= function(t) { items = t;return chart;}
		chart.item	= function(k,u) { items.push({ id: k, val: u});return chart;}
		chart.init	= function() {
			var cout = 0;
			d3.select(this).append('table').attr('class', 'table table-condensed table-striped table-hover').append('tbody').selectAll().data(items).enter().each(function(d,i) {
				cout += ingredients[d.id]['prix']*d.val/ingredients[d.id]['ratio']
				var t = d3.select(this).append('tr')
				t.append('td').call(obj.ing_item(d.id))
				t.append('td').attr('class','text-right')
					.html(bs.api.format.number(d.val)+' '+ingredients[d.id]['unite_usage'])
			});
			var f = d3.select(this).select('table').append('tfoot');
			f.append('th').html('Coût total');
			f.append('td').attr('class','text-right').html(bs.api.format.number(cout)+' €');
			//d3.select(this).append('p').html('Cout total :'+);
		}
		return chart;
	}


	obj.mat_item	= function(id) {
		var id=id;
		function chart(s) { s.each(chart.init); return chart; }
		chart.init	= function() { 
			var root= d3.select(this).append('a')
				.html(materiels[id]['nom'])
				.attr('data-toggle','modal').attr('data-target', '#mat_'+id).on('click.bs.modal.data-api',		bs.api.modal.click);
			return chart;
		};
		return chart;
	}
	obj.mat_modal	= function(id) {
		var l =  bs.list();
		materiels[id]['used'].forEach(function(k) {
			l.add(obj.rec_item(k));
		});
		var chart = bs.modal().id('mat_'+id).title(materiels[id]['nom']).body(
			bs.union().item(bs.p('Utilisé dans les recettes suivantes :'))
			.item(l)
		);
		return chart;
	}

	obj.rec_item	= function(id) {
		var id=id;
		function chart(s) { s.each(chart.init); return chart; }
		chart.init	= function() { 
			var root= d3.select(this).append('a').html(recettes[id]['nom']).attr('href', 'javascript:r.render("recette","'+id+'");false;');
			return chart;
		};
		return chart;
	}
	obj.rec_etapes = function (id) {
		var id = id;
		function chart(s) { s.each(chart.init); return chart; }
		chart.init	= function() {
			d3.select(this).append('ol').selectAll('li').data(recettes[id]['etapes']).enter().append('li').each(function(d,i) {
				d3.select(this).html(d)
			});
			return chart;
		};
		return chart;
	}

	r.hidden	= function() {
		var hid = bs.union();
		for (var k in ingredients) {
			hid.item(obj.ing_modal(k));
		}
		for (var k in materiels) {
			hid.item(obj.mat_modal(k));
		}
		d3.select('#hidden').call(hid);
	}
	r.render	= function(type, id) {
		d3.select('section.content').html("");
		var mat_lst = bs.list();
		var ing = bs.box().title('Ingrédients');
		var mat = bs.box().title('Matériaux').body(mat_lst);
		var rec = bs.box().title('Recettes');
		switch(type) {
		case 'recette':
			rec.title('Recette').tool(bs.button.a().text('Retour')
				.url('javascript:r.render();false'));
			var ing_lst = obj.ing_table();
			ing.body(ing_lst);
			for (var k in recettes[id]['ingredients']) {
				ing_lst.item(k, recettes[id]['ingredients'][k]);
			}
			recettes[id]['materiels'].forEach(function(k) {
				mat_lst.add(obj.mat_item(k));
			});
			rec.body(bs.union()
				.item(bs.p(recettes[id]['desc']))
				.item(obj.rec_etapes(id))
			);
		break;
		case 'home':
		default:
			var rec_lst = bs.list();
			var ing_lst = bs.list();
			ing.body(ing_lst);
			rec.body(rec_lst);
			for (var k in ingredients) {
				ing_lst.add(obj.ing_item(k));
			}
			for (var k in materiels) {
				mat_lst.add(obj.mat_item(k));
			}
			for (var k in recettes) {
				rec_lst.add(obj.rec_item(k));
			}
		break;
		}
		d3.select('section.content').call(bs.row()
			.cell('col-lg-4', bs.union().item(ing).item(mat))
			.cell('col-lg-8', rec)
		);
	}
}));
