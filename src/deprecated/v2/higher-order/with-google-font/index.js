/**
 * External dependencies
 */
import { loadGoogleFontInAttributes } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'

const withGoogleFont = createHigherOrderComponent(
	WrappedComponent => {
		const NewComponent = props => {
			const isEditingTemplate = useSelect( select =>
				select( 'core/edit-post' )?.isEditingTemplate?.()
			)

			// Reload the Google Fonts in the editor when switching to and from page template editing.
			useEffect( () => {
				loadGoogleFontInAttributes( props.attributes )
			}, [ isEditingTemplate ] )

			return <WrappedComponent { ...props } />
		}

		NewComponent.defaultProps = {
			attributes: {},
		}

		return NewComponent
	},
	'withGoogleFont'
)

export default withGoogleFont
