/**
 * BLOCK: Heading Block.
 */
/**
 * External dependencies
 */
import { HeadingIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import transforms from './transforms'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'

export const settings = {
	...metadata,
	icon: HeadingIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
	},
	deprecated,
	edit,
	save,
	example,
	transforms,
	merge( attributes, attributesToMerge ) {
		// Make sure that the selection is always at the end of the text.
		// @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/block-library/src/paragraph/index.js
		return {
			text:
				( attributes.text || '' ) +
			( ( attributesToMerge.hasOwnProperty( 'content' ) ? attributesToMerge.content : attributesToMerge.text ) || '' ),
		}
	},
}
