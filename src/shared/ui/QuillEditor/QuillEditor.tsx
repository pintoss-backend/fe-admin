import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Quill 에디터 설정
const quillModules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: [] }, { background: [] }],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['link'],
		['clean'],
	],
};

const quillFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'color',
	'background',
	'list',
	'link',
];

interface QuillEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	style?: React.CSSProperties;
	height?: number;
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
	value,
	onChange,
	placeholder = '',
	style,
	height = 200,
}) => {
	const defaultStyle = {
		height: `${height}px`,
		marginBottom: '42px',
		...style,
	};

	return (
		<ReactQuill
			value={value}
			onChange={onChange}
			modules={quillModules}
			formats={quillFormats}
			placeholder={placeholder}
			style={defaultStyle}
		/>
	);
};
