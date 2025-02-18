/**
 * External dependencies
 */
import {
	BlockDiv,
	Style,
	BlockLink,
	Alignment,
	EffectsAnimations,
	ConditionalDisplay,
	CustomAttributes,
	ContainerDiv,
	CustomCSS,
	Responsive,
	Advanced,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	BlockLink.addAttributes( attrObject )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
