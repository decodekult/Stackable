/**
 * External dependencies
 */
import {
	omit, compact, head, isPlainObject, cloneDeep,
} from 'lodash'

/**
 * WordPress dependencies
 */
import {
	registerStore, dispatch, select,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'

// Include all the stored state.
const DEFAULT_STATE = {
	defaultColors: [],
	useStackableColorsOnly: false,
	stackableColors: [],
	isInitializing: true,
}

const STORE_ACTIONS = {
	updateSettings: ( payload = {} ) => ( {
		type: 'UPDATE_SETTINGS',
		payload: omit( payload, 'type' ),
	} ),
}

const STORE_SELECTORS = {
	getSettings: state => state,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				...action.payload,
			}
		}
		default: {
			return state
		}
	}
}

registerStore( 'stackable/global-colors', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )

/**
 * Function for converting stackable_global_colors beta to release version.
 *
 * @param {Array} colors old stackable coloas array
 * @return {Array} new stackable global color array
 */
const convertBetaStackableColorsToRelease = colors => compact( ( colors || [] ).map( color => {
	if ( ! isPlainObject( color ) ) {
		return null
	}

	if ( color.fallback && color.colorVar ) {
		// Let us not include global colors linked to theme colors.
		return color.slug.startsWith( 'stk-global-color' )
			? {
				color: color.fallback,
				slug: `stk-global-color-${ Math.floor( Math.random() * new Date().getTime() ) % 100000 }`,
				rgb: color.rgb || '0, 0, 0',
				name: color.name || 'Untitled Color',
			} : null
	}

	return color
} ) )

// Load all our settings into our store.
domReady( () => {
	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const {
				stackable_global_colors_palette_only: useStackableColorsOnly,
				stackable_global_colors: _stackableColors,
			} = response

			let stackableColors = head( _stackableColors ) || []

			let stackableColorSlugs = stackableColors.map( color => color.slug )

			let colors

			// Added compatibility from Global Settings Beta to Release Version.
			const _colors = compact( select( 'core/block-editor' ).getSettings().colors )
			if ( ( _colors || [] ).some( color => color.fallback && color.colorVar ) ) {
				colors = convertBetaStackableColorsToRelease( _colors )
				dispatch( 'core/block-editor' ).updateSettings( { colors } )
				stackableColors = colors.filter( ( { slug } ) => slug.match( /^stk-global-color/ ) )
				stackableColorSlugs = stackableColors.map( color => color.slug )
			} else {
				colors = _colors || []
			}
			const defaultColors = colors.filter( ( { slug } ) => ! stackableColorSlugs.includes( slug ) )

			dispatch( 'stackable/global-colors' ).updateSettings( {
				defaultColors,
				useStackableColorsOnly,
				stackableColors,
				isInitializing: false,
			} )

			/**
			 * withColorContext now gets the colors from features object.
			 *
			 * @since v2.7.2
			 */
			if ( useStackableColorsOnly ) {
				setTimeout( () => {
					/**
					 * withColorContext (our color picker uses this) now gets the colors
					 * from the __experimentalFeatures object
					 *
					 * We need to clone and add only the colors we need because the
					 * object may have other properties.
					 */
					const experimentalFeatures = cloneDeep( select( 'core/block-editor' ).getSettings().__experimentalFeatures || {} )
					if ( typeof experimentalFeatures.color === 'undefined' ) {
						experimentalFeatures.color = {}
					}
					if ( typeof experimentalFeatures.color.palette === 'undefined' ) {
						experimentalFeatures.color.palette = {}
					}
					experimentalFeatures.color.palette.theme = []

					dispatch( 'core/block-editor' ).updateSettings( { __experimentalFeatures: experimentalFeatures } )
				}, 300 )
			}
		} )
	} )
} )
