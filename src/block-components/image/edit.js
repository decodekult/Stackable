/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedFocalPointControl,
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToggleControl,
	ButtonIconPopoverControl,
	ImageAltControl,
	ImageControl2,
	ImageFilterControl,
	ImageShapeControl,
	ImageSizeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ShadowControl,
	ColorPaletteControl,
	AdvancedToolbarControl,
	BlendModeControl,
	ControlSeparator,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import {
	sprintf, _x, __,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

// Note: image drop shadows do not accept negative spread.
const IMAGE_SHADOWS = [
	'none',
	'0px 0 1px rgba(120, 120, 120, 0.5)',
	'0px 0 2px rgba(120, 120, 120, 0.5)',
	'0px 5px 10px rgba(153, 153, 153, 0.35)',
	'0px 2px 20px rgba(153, 153, 153, 0.2)',
	'25px 10px 30px rgba(18, 63, 82, 0.3)',
	'0px 10px 30px rgba(0, 0, 0, 0.1)',
	'7px 5px 30px rgba(72, 73, 121, 0.15)',
	'0px 10px 60px rgba(0, 0, 0, 0.1)',
	'70px 60px 60px rgba(72, 73, 121, 0.2) ',
]

const Controls = props => {
	const {
		blockState = 'normal',
	} = props

	const attributes = useBlockAttributesContext( attributes => {
		return {
			imageId: attributes.imageId,
			imageWidthUnit: attributes.imageWidthUnit,
			imageHeightUnit: attributes.imageHeightUnit,
			imageWidth: attributes.imageWidth,
			imageHeight: attributes.imageHeight,
			imageSize: attributes.imageSize,
			imageAlt: attributes.imageAlt,
			imageOverlayColorType: attributes.imageOverlayColorType,
			imageOverlayGradientDirection: attributes.imageOverlayGradientDirection,
			imageOverlayGradientLocation1: attributes.imageOverlayGradientLocation1,
			imageOverlayGradientLocation2: attributes.imageOverlayGradientLocation2,
			imageUrl: attributes.imageUrl,
			imageShapeFlipX: attributes.imageShapeFlipX,
			imageShapeFlipY: attributes.imageShapeFlipY,
			imageShapeStretch: attributes.imageShapeStretch,
			imageShape: attributes.imageShape,
			imageFilter: attributes.imageFilter,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()

	// Get the image size urls.
	const { imageData } = useSelect( select => {
		const image = select( 'core' ).getMedia( attributes.imageId )
		return { imageData: { ...image } }
	}, [ attributes.imageId ] )

	const borderRadiusSliderMax = useMemo( () => {
		if (
			attributes.imageWidthUnit === 'px' &&
			[ '', 'px' ].includes( attributes.imageHeightUnit )
		) {
			return ( Math.max( attributes.imageWidth, attributes.imageHeight ) || 200 ) / 2
		}

		if ( attributes.imageWidthUnit === 'px' ) {
			return attributes.imageWidth
		}

		if ( [ '', 'px' ].includes( attributes.imageHeightUnit ) ) {
			return ( ( attributes.imageHeight || 200 ) / 2 )
		}

		return 100
	}, [ attributes.imageWidth, attributes.imageWidthUnit, attributes.imageHeight, attributes.imageHeightUnit ] )

	return (
		<>
			{ applyFilters( 'stackable.block-component.image.before', null, props ) }
			{ props.hasSelector && (
				<ImageControl2 // TODO: add selected image size as a prop.
					label={ __( 'Select Image', i18n ) }
					allowedTypes={ [ 'image' ] }
					attribute="image"
					onRemove={ () => setAttributes( {
						imageId: '',
						imageUrl: '',
						imageWidthAttribute: '',
						imageHeightAttribute: '',
					} ) }
					onChange={ image => {
						// Get the URL of the currently selected image size.
						let {
							url,
							width,
							height,
						} = image
						const currentSelectedSize = attributes.imageSize || 'full'
						if ( image.sizes?.[ currentSelectedSize ] ) {
							url = image.sizes?.[ currentSelectedSize ]?.url || url
							height = image.sizes?.[ currentSelectedSize ]?.height || height || ''
							width = image.sizes?.[ currentSelectedSize ]?.width || width || ''
						}
						setAttributes( {
							imageId: image.id,
							imageUrl: url,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
							...( attributes.imageAlt ? {} : { imageAlt: image.alt || '' } ), // Only set the alt if it's empty.
						} )
					} }
				/>
			) }

			{ props.hasWidth &&
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					attribute="imageWidth"
					units={ props.widthUnits }
					min={ props.widthMin }
					sliderMax={ props.widthMax }
					step={ props.widthStep }
					initialPosition={ 100 }
					allowReset={ true }
					placeholder="250" // TODO: This should be referenced somewher instead of just a static number
					responsive="all"
				/>
			}

			{ props.hasHeight &&
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					attribute="imageHeight"
					units={ props.heightUnits }
					min={ props.heightMin }
					sliderMax={ props.heightMax }
					step={ props.heightStep }
					allowReset={ true }
					placeholder=""
					responsive="all"
				/>
			}

			{ props.hasAlt && (
				<ImageAltControl
					label={ __( 'Image Alt', i18n ) }
					value={ attributes.imageAlt }
					onChange={ imageAlt => setAttributes( { imageAlt } ) }
				/>
			) }

			<AdvancedRangeControl
				label={ __( 'Zoom', i18n ) }
				attribute="imageZoom"
				hover="all"
				min={ 0 }
				sliderMax={ 3 }
				step={ 0.01 }
				initialPosition={ 1 }
				allowReset={ true }
			/>

			{ props.hasShadow && (
				<ShadowControl
					options={ IMAGE_SHADOWS }
					attribute="imageShadow"
					hover="all"
					isFilter={ true }
				/>
			) }

			{ attributes.imageId && (
				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ attributes.imageSize }
					onChange={ imageSize => {
						const imageUrl = imageData.media_details?.sizes[ imageSize ]?.source_url || imageData.source_url
						const width = imageData.media_details?.sizes[ imageSize ]?.width || imageData.media_details?.width || ''
						const height = imageData.media_details?.sizes[ imageSize ]?.height || imageData.media_details?.height || ''
						setAttributes( {
							imageSize,
							imageUrl,
							imageWidthAttribute: width,
							imageHeightAttribute: height,
						} )
					} }
					defaultValue="full"
					className="ugb--help-tip-image-size"
				/>
			) }

			{ props.hasBorderRadius &&
				<AdvancedRangeControl
					label={ __( 'Border Radius', i18n ) }
					attribute="imageBorderRadius"
					min="0"
					sliderMax={ borderRadiusSliderMax }
					placeholder="0"
					defaultValue={ 0 }
					allowReset={ true }
					className="ugb--help-tip-general-border-radius"
				/>
			}

			<ControlSeparator />

			<AdvancedToolbarControl
				controls={ [
					{
						value: '',
						title: __( 'Single', i18n ),
					},
					{
						value: 'gradient',
						title: __( 'Gradient', i18n ),
					},
				] }
				attribute="imageOverlayColorType"
				fullwidth={ false }
				isSmall={ true }
			/>

			<ColorPaletteControl
				label={
					attributes.imageOverlayColorType === 'gradient'
						? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Overlay Color', i18n ), 1 )
						: __( 'Overlay Color', i18n )
				}
				attribute="imageOverlayColor"
				hover="all"
				hasTransparent={ attributes.imageOverlayColorType === 'gradient' }
			/>
			{ attributes.imageOverlayColorType === 'gradient' && (
				<ColorPaletteControl
					label={ sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Overlay Color', i18n ), 2 ) }
					attribute="imageOverlayColor2"
					hover="all"
					hasTransparent={ true }
				/>
			) }

			<AdvancedRangeControl
				label={ __( 'Overlay Opacity', i18n ) }
				attribute="imageOverlayOpacity"
				hover="all"
				min={ 0 }
				max={ 1 }
				step={ 0.1 }
				placeholder="0.3"
			/>

			<BlendModeControl
				label={ __( 'Overlay Blend Mode', i18n ) }
				attribute="imageOverlayBlendMode"
				className="ugb--help-tip-background-blend-mode"
			/>

			{ attributes.imageOverlayColorType === 'gradient' && (
				<ButtonIconPopoverControl
					label={ __( 'Gradient Overlay Settings', i18n ) }
					onReset={ () => {
						setAttributes( {
							[ getAttributeName( 'imageOverlayGradientDirection', 'desktop', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation1', 'desktop', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation2', 'desktop', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientDirection', 'tablet', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation1', 'tablet', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation2', 'tablet', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientDirection', 'mobile', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation1', 'mobile', blockState ) ]: '',
							[ getAttributeName( 'imageOverlayGradientLocation2', 'mobile', blockState ) ]: '',
						} )
					} }
					allowReset={
						attributes[ getAttributeName( 'imageOverlayGradientDirection', 'desktop', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation1', 'desktop', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation2', 'desktop', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientDirection', 'tablet', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation1', 'tablet', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation2', 'tablet', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientDirection', 'mobile', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation1', 'mobile', blockState ) ] ||
						attributes[ getAttributeName( 'imageOverlayGradientLocation2', 'mobile', blockState ) ]
					}
				>
					<AdvancedRangeControl
						label={ __( 'Gradient Direction (degrees)', i18n ) }
						attribute="imageOverlayGradientDirection"
						hover="all"
						min={ 0 }
						max={ 360 }
						step={ 10 }
						allowReset={ true }
						placeholder="90"
						className="ugb--help-tip-gradient-direction"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 1 ) }
						attribute="imageOverlayGradientLocation1"
						hover="all"
						sliderMin={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
						className="ugb--help-tip-gradient-location"
					/>

					<AdvancedRangeControl
						label={ sprintf( __( 'Color %d Location', i18n ), 2 ) }
						attribute="imageOverlayGradientLocation2"
						hover="all"
						sliderMin={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="100"
						className="ugb--help-tip-gradient-location"
					/>
				</ButtonIconPopoverControl>
			) }

			<ControlSeparator />

			<AdvancedFocalPointControl
				attribute="imageFocalPoint"
				label={ __( 'Focal point', i18n ) }
				url={ props.src ? props.src : attributes.imageUrl }
				responsive="all"
				hover="all"
			/>

			<AdvancedSelectControl
				label={ __( 'Image Fit', i18n ) }
				attribute="imageFit"
				options={ [
					{ label: __( 'Default', i18n ), value: '' },
					{ label: __( 'Contain', i18n ), value: 'contain' },
					{ label: __( 'Cover', i18n ), value: 'cover' },
					{ label: __( 'Fill', i18n ), value: 'fill' },
					{ label: __( 'None', i18n ), value: 'none' },
					{ label: __( 'Scale Down', i18n ), value: 'scale-down' },
				] }
				className="ugb--help-tip-background-image-size"
				responsive="all"
			/>

			{ props.hasShape &&
				<ButtonIconPopoverControl
					label={ __( 'Image Shape', i18n ) }
					onReset={ () => {
						setAttributes( {
							imageShape: '',
							imageShapeFlipX: '',
							imageShapeFlipY: '',
							imageShapeStretch: true,
						} )
					} }
					allowReset={
						attributes.imageShape ||
							attributes.imageShapeFlipX ||
							attributes.imageShapeFlipY ||
							! attributes.imageShapeStretch
					}
				>
					<ImageShapeControl
						selected={ attributes.imageShape }
						onChange={ imageShape => setAttributes( { imageShape } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Shape Horizontally', i18n ) }
						attribute="imageShapeFlipX"
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Shape Vertically', i18n ) }
						attribute="imageShapeFlipY"
					/>
					<AdvancedToggleControl
						label={ __( 'Stretch Shape Mask', i18n ) }
						attribute="imageShapeStretch"
						defaultValue={ true }
					/>
				</ButtonIconPopoverControl>
			}

			<ButtonIconPopoverControl
				label={ __( 'Image Filter', i18n ) }
				popoverLabel=""
				onReset={ () => {
					setAttributes( { imageFilter: '' } )
				} }
				allowReset={ attributes.imageFilter }
			>
				<ImageFilterControl
					label={ __( 'Image Filter', i18n ) }
					attribute="imageFilter"
					hover="all"
				/>
			</ButtonIconPopoverControl>
		</>
	)
}

Controls.defaultProps = {
	hasAlt: true,
	hasWidth: true,
	hasSelector: true,
	hasShadow: true,
	widthUnits: [ 'px', '%', 'vw' ],
	widthMin: [ 0, 0, 0 ],
	widthMax: [ 1000, 100, 100 ],
	widthStep: [ 1, 1, 1 ],

	hasHeight: true,
	heightUnits: [ 'px', '%', 'vh' ],
	heightMin: [ 0, 0, 0 ],
	heightMax: [ 1000, 100, 100 ],
	heightStep: [ 1, 1, 1 ],

	hasBorderRadius: true,
	hasShape: true,
}

export const Edit = props => {
	const imageShow = useBlockAttributesContext( attributes => attributes.imageShow )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ props.label }
				id="image"
				initialOpen={ props.initialOpen }
				hasToggle={ props.hasToggle }
				{ ...( props.hasToggle ? {
					checked: imageShow,
					onChange: imageShow => setAttributes( { imageShow } ),
				} : {} ) }
			>
				<Controls { ...props } />
			</PanelAdvancedSettings>

		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	initialOpen: false,
	label: __( 'Image', i18n ),
	hasToggle: false,
	hasAlt: true,
	hasWidth: true,
	hasSelector: true,
	hasShadow: true,
	widthUnits: [ 'px', '%', 'vw' ],
	widthMin: [ 0, 0, 0 ],
	widthMax: [ 1000, 100, 100 ],
	widthStep: [ 1, 1, 1 ],

	hasHeight: true,
	heightUnits: [ 'px', '%', 'vh' ],
	heightMin: [ 0, 0, 0 ],
	heightMax: [ 1000, 100, 100 ],
	heightStep: [ 1, 1, 1 ],

	hasBorderRadius: true,
	hasShape: true,
}

Edit.Controls = Controls
