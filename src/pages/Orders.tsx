import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { Order } from '../types';
import { Search, Filter, Eye, CheckCircle, Package, Truck, XCircle, Clock, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export function Orders() {
  const { orders, api } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerPhone && o.customerPhone.includes(searchTerm));
      
      const matchesStatus = statusFilter ? o.status === statusFilter : true;
      
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const orderDate = parseISO(o.date);
        const start = dateFrom ? startOfDay(parseISO(dateFrom)) : new Date(0);
        const end = dateTo ? endOfDay(parseISO(dateTo)) : new Date(8640000000000000);
        matchesDate = isWithinInterval(orderDate, { start, end });
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Confirmed': return 'default'; // We'll use default (blue-ish) or custom
      case 'Pending': return 'warning';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Confirmed': return <Package className="h-4 w-4 text-blue-500" />;
      case 'Pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by ID, name, phone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
                <select 
                  className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    className="w-auto" 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.target.value)} 
                    title="From Date"
                  />
                  <span className="text-gray-500">-</span>
                  <Input 
                    type="date" 
                    className="w-auto" 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.target.value)} 
                    title="To Date"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-indigo-600">{order.id}</TableCell>
                    <TableCell>
                      {order.customerName}
                      <div className="text-xs text-gray-500 md:hidden">
                        {order.customerPhone || 'No phone'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-500">
                      {order.customerPhone || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-500 whitespace-nowrap">
                      {format(new Date(order.date), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status) as any} className={order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange(order.id, 'Delivered')}
                            className="hidden sm:flex h-8 text-xs"
                          >
                            <Truck className="mr-1 h-3 w-3" /> Deliver
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openOrderDetails(order)}>
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      No orders found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Order Details - ${selectedOrder?.id}`}
        className="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Current Status:</span>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-semibold">{selectedOrder.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Update Status:</span>
                <select 
                  className="h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {selectedOrder.status !== 'Delivered' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                    className="bg-green-600 hover:bg-green-700 text-white ml-2"
                  >
                    <Truck className="mr-2 h-4 w-4" /> Mark as Delivered
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" /> Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{selectedOrder.customerEmail || 'N/A'}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{selectedOrder.customerPhone || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery & Payment */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" /> Delivery & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                      <p className="text-gray-600 leading-relaxed">{selectedOrder.deliveryAddress || 'No address provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Payment Method</p>
                      <p className="text-gray-600">{selectedOrder.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" /> Order Items ({selectedOrder.items})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.itemsList && selectedOrder.itemsList.length > 0 ? (
                    selectedOrder.itemsList.map(item => (
                      <div key={item.id} className="flex items-center py-3 first:pt-0 last:pb-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover border border-gray-200 mr-4" />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mr-4">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center">No item details available.</p>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold mt-4 pt-4 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-indigo-600">${selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

