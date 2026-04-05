import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';
import { Search, Plus, Mail, Phone, Eye, User, MapPin, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

export function Customers() {
  const { orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute customers dynamically from orders
  const computedCustomersMap = new Map();
  orders.forEach(order => {
    const key = order.customerPhone || order.customerEmail || order.customerName;
    if (!computedCustomersMap.has(key)) {
      computedCustomersMap.set(key, {
        id: `CUST-${key.replace(/[^a-zA-Z0-9]/g, '')}`,
        name: order.customerName,
        email: order.customerEmail || 'No Email',
        phone: order.customerPhone || 'No Phone',
        totalSpent: 0,
        orders: 0
      });
    }
    const existing = computedCustomersMap.get(key);
    existing.totalSpent += order.total;
    existing.orders += 1;
  });
  const customers = Array.from(computedCustomersMap.values());

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const openCustomerDetails = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const customerOrders = selectedCustomer 
    ? orders.filter(o => o.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search customers by name, email, or phone..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact Info</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.name}
                    <div className="text-xs text-gray-500 md:hidden flex flex-col mt-1 space-y-1">
                      <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {customer.email}</span>
                      <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1 text-sm text-gray-500">
                      <span className="flex items-center"><Mail className="h-3 w-3 mr-2" /> {customer.email}</span>
                      <span className="flex items-center"><Phone className="h-3 w-3 mr-2" /> {customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    ৳{customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-gray-500">
                    {customer.orders}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openCustomerDetails(customer)}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Customer Details"
        className="max-w-3xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Customer ID: {selectedCustomer.id}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{selectedCustomer.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{selectedCustomer.phone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-gray-600 leading-relaxed">
                      123 Main St, Apt 4B<br/>
                      New York, NY 10001
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-500" /> Lifetime Value
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-emerald-600">৳{selectedCustomer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-indigo-600">{selectedCustomer.orders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-gray-500" /> Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customerOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-indigo-600">{order.id}</TableCell>
                          <TableCell className="text-gray-500">
                            {format(new Date(order.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ৳{
                              order.status === 'Delivered' ? "bg-green-100 text-green-700" :
                              order.status === 'Confirmed' ? "bg-blue-100 text-blue-700" :
                              order.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ৳{order.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">No orders found for this customer.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

