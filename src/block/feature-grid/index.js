/**
 * BLOCK: Feature Grid Block.
 */

/**
 * External dependencies
 */
import { FeatureGridIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import variations from './variations'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: FeatureGridIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkAlign: true,
	},
	//  styles: blockStyles,

	// deprecated,
	variations,
	edit,
	save,
} )
