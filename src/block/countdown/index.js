/**
 * BLOCK: Countdown Block.
 */
/**
 * External dependencies
 */
import { CountdownIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import example from './example'
import save from './save'
import schema from './schema'
import metadata from './block.json'

export const settings = {
	...metadata,
	icon: CountdownIcon,
	edit,
	save,
	example,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
	},
}

