/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'
import classnames from 'classnames'

const ALIGN_OPTIONS = [
	{
		value: 'left',
		title: __( 'Align Left', i18n ),
		icon: 'editor-alignleft',
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: 'editor-aligncenter',
	},
	{
		value: 'right',
		title: __( 'Align Right', i18n ),
		icon: 'editor-alignright',
	},
	{
		value: 'justify',
		title: __( 'Justified', i18n ),
		icon: 'editor-justify',
	},
]

const ALIGN_OPTIONS_NO_JUSTIFY = ALIGN_OPTIONS.filter( option => option.value !== 'justify' )

const AlignButtonsControl = props => {
	const {
		justified,
		className,
		...propsToPass
	} = props

	return (
		<AdvancedToolbarControl
			{ ...propsToPass }
			className={ classnames( [ className, 'ugb-align-buttons-control' ] ) }
			controls={ justified ? ALIGN_OPTIONS : ALIGN_OPTIONS_NO_JUSTIFY }
		/>
	)
}

AlignButtonsControl.defaultProps = {
	className: '',
	label: __( 'Align', i18n ),
	justified: false,
}

export default AlignButtonsControl
