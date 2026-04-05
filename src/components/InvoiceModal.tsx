import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Order } from '../types';
import { Button } from './ui/Button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  const [editableOrder, setEditableOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) {
      setEditableOrder({ ...order });
    } else {
      setEditableOrder(null);
    }
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!editableOrder || !editableOrder.itemsList) return;
    const newItems = [...editableOrder.itemsList];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total
    const newTotal = newItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    
    setEditableOrder({ ...editableOrder, itemsList: newItems, total: newTotal });
  };

  if (!isOpen || !editableOrder) return null;

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            input {
              border: none !important;
              background: transparent !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
              outline: none !important;
              font: inherit !important;
              color: inherit !important;
              width: 100% !important;
            }
          }
        `}
      </style>
      <Modal isOpen={isOpen} onClose={onClose} title="Invoice Preview" className="max-w-4xl max-h-[90vh] overflow-y-auto w-full no-print">
        <div className="flex justify-end mb-4 no-print gap-2 border-b pb-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </Button>
        </div>

        <div id="printable-invoice" className="bg-white p-8 text-black print:text-black shadow-sm border border-gray-200 min-h-[500px]">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">INVOICE</h1>
              <div className="text-sm text-gray-500">Invoice #: 
                <input 
                  type="text" 
                  value={editableOrder.id} 
                  onChange={(e) => setEditableOrder({ ...editableOrder, id: e.target.value })}
                  className="font-mono text-gray-900 border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 ml-1 w-64 bg-transparent outline-none transition-colors"
                />
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">Gunjan Telecom</h2>
              <p className="text-sm text-gray-500 mt-1">123 Business Avenue</p>
              <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
              <p className="text-sm text-gray-500">Phone: +880 1700-000000</p>
            </div>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div className="w-1/2 pr-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
              <input 
                value={editableOrder.customerName || ''} 
                onChange={(e) => setEditableOrder({ ...editableOrder, customerName: e.target.value })}
                placeholder="Customer Name"
                className="font-bold text-gray-900 text-lg w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 -ml-1 bg-transparent outline-none transition-colors mb-1"
              />
              <input 
                value={editableOrder.customerPhone || ''} 
                onChange={(e) => setEditableOrder({ ...editableOrder, customerPhone: e.target.value })}
                placeholder="Phone Number"
                className="text-gray-600 text-sm w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 -ml-1 bg-transparent outline-none transition-colors mb-1"
              />
              <textarea 
                value={editableOrder.deliveryAddress || ''} 
                onChange={(e) => setEditableOrder({ ...editableOrder, deliveryAddress: e.target.value })}
                placeholder="Delivery Address"
                className="text-gray-600 text-sm w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 -ml-1 bg-transparent outline-none transition-colors resize-none h-16"
              />
            </div>
            <div className="w-1/3 text-right">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-gray-500 uppercase">Date:</span>
                <input 
                  type="date"
                  value={editableOrder.date ? format(new Date(editableOrder.date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEditableOrder({ ...editableOrder, date: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() })}
                  className="text-gray-900 text-sm border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 text-right bg-transparent outline-none transition-colors w-36"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase">Payment:</span>
                <input 
                  value={editableOrder.paymentMethod || ''}
                  onChange={(e) => setEditableOrder({ ...editableOrder, paymentMethod: e.target.value })}
                  placeholder="Method"
                  className="text-gray-900 text-sm border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-1 text-right bg-transparent outline-none transition-colors w-32"
                />
              </div>
            </div>
          </div>

          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-2 text-sm font-bold text-gray-900 uppercase">Item Description</th>
                <th className="py-2 text-sm font-bold text-gray-900 uppercase text-center w-24">Qty</th>
                <th className="py-2 text-sm font-bold text-gray-900 uppercase text-right w-32">Price</th>
                <th className="py-2 text-sm font-bold text-gray-900 uppercase text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {editableOrder.itemsList?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 group">
                  <td className="py-3 pr-4">
                    <input 
                      value={item.name} 
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="text-gray-900 font-medium border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 w-full bg-transparent outline-none transition-colors"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input 
                      type="number"
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className="text-gray-900 text-center border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 w-full bg-transparent outline-none transition-colors"
                    />
                  </td>
                  <td className="py-3 pl-2">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-500 mr-1">৳</span>
                      <input 
                        type="number"
                        value={item.price} 
                        onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                        className="text-gray-900 text-right border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 w-full bg-transparent outline-none transition-colors"
                      />
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-900 items-center justify-end">
                    ৳{((item.price || 0) * (item.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end border-t-2 border-gray-900 pt-4">
            <div className="w-1/2 sm:w-1/3">
              <div className="flex justify-between items-center py-2 text-xl font-bold text-gray-900">
                <span>Total Due</span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input 
                    type="number"
                    value={editableOrder.total} 
                    onChange={(e) => setEditableOrder({ ...editableOrder, total: Number(e.target.value) })}
                    className="text-right border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 w-32 bg-transparent outline-none transition-colors text-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
            <p className="font-medium text-gray-900">Thank you for your business!</p>
            <p className="mt-1">For any inquiries, please contact us.</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
