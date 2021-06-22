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
	ImageControl,
	ImageFilterControl,
	ImageShapeControl,
	ImageSizeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ShadowControl,
} from '~stackable/components'
import {
	useBlockAttributes,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch, useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	// Get the image size urls.
	const { imageData } = useSelect( select => {
		const image = select( 'core' ).getMedia( attributes.imageId )
		return { imageData: { ...image } }
	}, [ attributes.imageId ] )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Image', i18n ) }
				id="image"
			>
				<ImageControl // TODO: add selected image size as a prop.
					label={ __( 'Select Image', i18n ) }
					allowedTypes={ [ 'image' ] }
					imageID={ attributes.imageId }
					imageURL={ attributes.imageUrl }
					onRemove={ () => updateBlockAttributes( clientId, { imageId: '', imageUrl: '' } ) }
					onChange={ image => {
						// Get the URL of the currently selected image size.
						let {
							url,
						} = image
						const currentSelectedSize = attributes.imageSize || 'full'
						if ( image.sizes[ currentSelectedSize ] ) {
							url = image.sizes[ currentSelectedSize ].url
						}
						updateBlockAttributes( clientId, { imageId: image.id, imageUrl: url } )
					} }
				/>

				{ props.hasWidth &&
					<AdvancedRangeControl
						label={ __( 'Width 2', i18n ) }
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
						placeholder="300" // TODO: This should be referenced somewher instead of just a static number
						responsive="all"
					/>
				}

				<ImageAltControl
					label={ __( 'Image Alt', i18n ) }
					value={ attributes.imageAlt }
					onChange={ imageAlt => updateBlockAttributes( clientId, { imageAlt } ) }
				/>

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

				<ShadowControl
					attribute="imageShadow"
					hover="all"
				/>

				<ImageSizeControl
					label={ __( 'Image Size', i18n ) }
					value={ attributes.imageSize }
					onChange={ imageSize => {
						const imageUrl = imageData.media_details?.sizes[ imageSize ]?.source_url || imageData.source_url
						updateBlockAttributes( clientId, { imageSize, imageUrl } )
					} }
					defaultValue="full"
					className="ugb--help-tip-image-size"
				/>

				{ props.hasBorderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						attribute="imageBorderRadius"
						min="0"
						sliderMax="30"
						placeholder="0"
						defaultValue={ 0 }
						allowReset={ true }
						className="ugb--help-tip-general-border-radius"
					/>
				}

				<AdvancedFocalPointControl
					attribute="imageFocalPoint"
					label={ __( 'Focal point', i18n ) }
					url={ attributes.imageUrl }
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
							updateBlockAttributes( clientId, {
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
							onChange={ imageShape => updateBlockAttributes( clientId, { imageShape } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Flip Shape Horizontally', i18n ) }
							checked={ attributes.imageShapeFlipX }
							onChange={ imageShapeFlipX => updateBlockAttributes( clientId, { imageShapeFlipX } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Flip Shape Vertically', i18n ) }
							checked={ attributes.imageShapeFlipY }
							onChange={ imageShapeFlipY => updateBlockAttributes( clientId, { imageShapeFlipY } ) }
						/>
						<AdvancedToggleControl
							label={ __( 'Stretch Shape Mask', i18n ) }
							checked={ attributes.imageShapeStretch }
							onChange={ imageShapeStretch => updateBlockAttributes( clientId, { imageShapeStretch } ) }
							defaultValue={ true }
						/>
					</ButtonIconPopoverControl>
				}

				<ButtonIconPopoverControl
					label={ __( 'Image Filter', i18n ) }
					onReset={ () => {
						updateBlockAttributes( clientId, { imageFilter: '' } )
					} }
					allowReset={ attributes.imageFilter }
				>
					<ImageFilterControl
						value={ attributes.imageFilter }
						onChange={ imageFilter => updateBlockAttributes( clientId, { imageFilter } ) }
					/>
				</ButtonIconPopoverControl>
			</PanelAdvancedSettings>

		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasWidth: true,
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