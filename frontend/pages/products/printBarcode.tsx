import Barcode from 'react-barcode';

export default function PrintBarcode() {
    return (
        <div className='p-5'>
            <Barcode value="1236123.35.0001" />
        </div>
    );
};