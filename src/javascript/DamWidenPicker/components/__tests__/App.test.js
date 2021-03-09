import React from 'react';
import {render} from '@testing-library/react';
import StringWidenAssetSelector from 'components/WidenPicker';

test('renders learn react link', () => {
    const {getByText} = render(<StringWidenAssetSelector/>);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
