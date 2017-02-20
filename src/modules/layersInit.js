const OTHER_VARIANT = '(другое)'

const layersInit = [
	{
		name: 'страны',
		active: true,
		vertical: true,
		variants: [
			OTHER_VARIANT,
			'СССР',
			'Россия',
			'США',
			'Франция',
		],
		splitter: (item, variant, variants) => {
			if(!item||!('страны' in item)) return false
			let itemVariant = item['страны'].split(',')[0]
			if((variants.indexOf(itemVariant) < 0)&&(variant === OTHER_VARIANT)) { return true }
			if(itemVariant === variant) { return true }
			return false
		}
	},
	{
		name: 'годы',
		active: false,
		vertical: false,
		variants: [
			OTHER_VARIANT,
			'1940-е',
			'1950-е',
			'1960-е',
			'1970-е',
			'1980-е',
			'1990-е',
			'2000-е',
			'2010-е',
		],
		splitter: (item, variant, variants) => {
			if(!item || !('год' in item)) return false
			let year = parseInt(item['год'].split(' - ')[0], 10)
			let decade = year - year % 10
			let itemVariant = decade + "-е"
			if((variants.indexOf(itemVariant) < 0)&&(variant === OTHER_VARIANT)) { return true }
			if(itemVariant === variant) { return true }
			return false
		}
	},
	{
		name: 'жанры',
		active: false,
		vertical: false,
		variants: [
			OTHER_VARIANT,
			'фантастика',
			'комедия',
			'боевик',
			'драма',
		],
		splitter: (item, variant, variants) => {
			if(!item || !('жанры' in item)) return false
			let itemVariants = item['жанры'].split(', ')
			if(itemVariants.includes(variant)) { return true }
			if((variant === OTHER_VARIANT) && (itemVariants.every(itemVariant => !variants.includes(itemVariant)))) { return true }
			return false
		}
	},
	{
		name: 'жанры2',
		active: false,
		vertical: false,
		variants: [
			OTHER_VARIANT,
			'мультфильм',
			'документальный',
		],
		splitter: (item, variant, variants) => {
			if(!item || !('жанры' in item)) return false
			let itemVariants = item['жанры'].split(', ')
			if(itemVariants.includes(variant)) { return true }
			if((variant === OTHER_VARIANT) && (itemVariants.every(itemVariant => !variants.includes(itemVariant)))) { return true }
			return false
		}
	}
]

export default layersInit