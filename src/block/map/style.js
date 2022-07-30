/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			renderIn: 'edit',
			selector: '.stk-block-map__canvas',
			styleRule: 'height',
			attrName: 'height',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'save',
			selector: '.stk-block-map__canvas, iframe',
			styleRule: 'height',
			attrName: 'height',
			format: '%spx',
			responsive: 'all',
		},
	]
}

const BlockStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const mapStyles = useStyles( attributes, getStyleParams() )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	return (
		<>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<StyleComponent
				styles={ mapStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

BlockStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

BlockStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )
	const mapStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ mapStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

export default BlockStyles