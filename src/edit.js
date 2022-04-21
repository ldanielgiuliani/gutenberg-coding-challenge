/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import { getEmojiFlag } from './utils';
import Preview from './preview';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const postId = select( 'core/editor' ).getCurrentPostId();
	const { countryCode, relatedPosts } = attributes;
	const options = Object.keys( countries ).map( ( code ) => ( {
		value: code,
		label: `${ getEmojiFlag( code ) } ${ countries[ code ] } — ${ code }`,
	} ) );

	const handleChangeCountry = () => {
		setAttributes( {
			countryCode: false,
		} );
	};

	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode && countryCode !== newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/posts?search=${ countries[ countryCode ] }&exclude=${ postId }`,
		} )
			.then( ( posts ) => {
				setAttributes( {
					relatedPosts:
						posts?.map( ( relatedPost ) => ( {
							...relatedPost,
							title:
								relatedPost.title?.rendered || relatedPost.link,
							excerpt: relatedPost.excerpt?.rendered || '',
						} ) ) || [],
				} );
			} )
			.catch( ( error ) => {
				throw new Error(
					`${ error.message } Status: ${ error.data.status }`
				);
			} );
	}, [ postId, countryCode, setAttributes ] );

	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Change Country', 'xwp-country-card' ) }
						icon={ edit }
						onClick={ handleChangeCountry }
						disabled={ ! Boolean( countryCode ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div className={ 'block-row' }>
				<div className={ 'block-column' }>
					<Placeholder
						icon={ globe }
						label={ __( 'XWP Country Card', 'xwp-country-card' ) }
						isColumnLayout={ true }
						instructions={ __(
							'Type in a name of a contry you want to display on you site.',
							'xwp-country-card'
						) }
					>
						<ComboboxControl
							label={ __( 'Country', 'xwp-country-card' ) }
							hideLabelFromVision
							options={ options }
							value={ countryCode }
							onChange={ handleChangeCountryCode }
							allowReset={ true }
						/>
					</Placeholder>
				</div>
				<div className={ 'block-column' }>
					<Preview
						countryCode={ countryCode }
						relatedPosts={ relatedPosts }
					/>
				</div>
			</div>
		</div>
	);
}
