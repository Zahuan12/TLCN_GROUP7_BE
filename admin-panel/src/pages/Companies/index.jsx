import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import SearchBar from '../../components/molecules/SearchBar';
import DataTable from '../../components/organisms/DataTable';
import Pagination from '../../components/molecules/Pagination';
import StatusBadge from '../../components/molecules/StatusBadge';
import CompanyFilters from './components/CompanyFilters';
import ApprovalActions from './components/ApprovalActions';
import CompanyActionMenu from './components/CompanyActionMenu';
import CompanyDetailModal from './components/CompanyDetailModal';
import { companyService } from '../../services/companyService';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import { COMPANY_STATUS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';
import { BuildingIcon } from 'lucide-react';

/**
 * CompaniesPage - Companies Management with approval workflow
 */
export default function CompaniesPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('pending');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { currentPage, setCurrentPage, totalPages, setTotalItems } = usePagination();
  const { showToast } = useToast();

  // Read status from URL query params and update activeTab
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      // Convert UPPERCASE to lowercase for tab value
      const tabValue = statusFromUrl.toLowerCase();
      if (['pending', 'approved', 'rejected'].includes(tabValue)) {
        setActiveTab(tabValue);
      }
    }
  }, [searchParams.get('status')]);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Determine status from active tab
      let statusFilter = filters.status;
      if (activeTab !== 'all') {
        statusFilter = activeTab.toUpperCase();
      }

      const response = await companyService.getAll({
        page: currentPage,
        search: debouncedSearch,
        status: statusFilter,
        industry: filters.industry,
      });

      setCompanies(response.data);
      setTotalItems(response.total);
    } catch (error) {
      showToast('Không thể tải danh sách công ty', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, debouncedSearch, filters, activeTab]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({ status: '', industry: '' });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
    setCurrentPage(1);
  };

  // Handle approve
  const handleApprove = async (company) => {
    try {
      await companyService.approve(company.id);
      showToast(`Đã phê duyệt công ty "${company.companyName}"`, 'success');
      fetchCompanies();
    } catch (error) {
      showToast('Không thể phê duyệt công ty', 'error');
    }
  };

  // Handle reject
  const handleReject = async (company, reason) => {
    try {
      await companyService.reject(company.id, reason);
      showToast(`Đã từ chối công ty "${company.companyName}"`, 'success');
      fetchCompanies();
    } catch (error) {
      showToast('Không thể từ chối công ty', 'error');
    }
  };

  // Handle view detail
  const handleView = (company) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };

  // Handle edit
  const handleEdit = (company) => {
    showToast('Chức năng chỉnh sửa đang được phát triển', 'info');
  };

  // Handle suspend
  const handleSuspend = async (company) => {
    if (!confirm(`Xác nhận tạm khóa công ty "${company.companyName}"?`)) {
      return;
    }

    try {
      await companyService.updateStatus(company.id, COMPANY_STATUS.SUSPENDED);
      showToast(`Đã tạm khóa công ty "${company.companyName}"`, 'success');
      fetchCompanies();
    } catch (error) {
      showToast('Không thể tạm khóa công ty', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (company) => {
    if (!confirm(`Xác nhận xóa công ty "${company.companyName}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await companyService.delete(company.id);
      showToast(`Đã xóa công ty "${company.companyName}"`, 'success');
      fetchCompanies();
    } catch (error) {
      showToast('Không thể xóa công ty', 'error');
    }
  };

  // Handle view career paths
  const handleViewPaths = (company) => {
    showToast('Chức năng xem Career Paths đang được phát triển', 'info');
  };

  // Handle view tests
  const handleViewTests = (company) => {
    showToast('Chức năng xem Tests đang được phát triển', 'info');
  };

  // Define columns
  const columns = [
    {
      key: 'companyName',
      label: 'Công ty',
      sortable: true,
      render: (company) => (
        <div>
          <div className="font-medium">{company.companyName}</div>
          <div className="text-sm text-muted-foreground">{company.industry || '—'}</div>
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Thống kê',
      render: (company) => (
        <div className="text-sm">
          <div>{company.stats.careerPathsCount || 0} paths</div>
          <div className="text-muted-foreground">{company.stats.studentsReached || 0} students</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (company) => <StatusBadge status={company.status} />,
    },
    {
      key: 'registeredDate',
      label: 'Ngày đăng ký',
      sortable: true,
      render: (company) => (
        <div className="text-sm">{formatDateTime(company.registeredDate)}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (company) => (
        <div className="flex items-center gap-2">
          {company.status === COMPANY_STATUS.PENDING && (
            <ApprovalActions
              company={company}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
          <CompanyActionMenu
            company={company}
            onView={handleView}
            onEdit={handleEdit}
            onSuspend={handleSuspend}
            onDelete={handleDelete}
            onViewPaths={handleViewPaths}
            onViewTests={handleViewTests}
          />
        </div>
      ),
    },
  ];

  // Count stats per status
  const allCompanies = companies; // In reality, you'd fetch all or get counts from API
  const pendingCount = allCompanies.filter((c) => c.status === COMPANY_STATUS.PENDING).length;
  const approvedCount = allCompanies.filter((c) => c.status === COMPANY_STATUS.APPROVED).length;
  const rejectedCount = allCompanies.filter((c) => c.status === COMPANY_STATUS.REJECTED).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý Công ty</h1>
        <p className="text-muted-foreground">
          Phê duyệt, quản lý các công ty đăng ký trên hệ thống
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tất cả
            <span className="ml-2 px-2 py-0.5 text-xs bg-muted rounded">
              {companies.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Chờ duyệt
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã duyệt
            <span className="ml-2 px-2 py-0.5 text-xs bg-muted rounded">
              {approvedCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Từ chối
            <span className="ml-2 px-2 py-0.5 text-xs bg-muted rounded">
              {rejectedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5" />
                Danh sách Công ty
              </CardTitle>
              <CardDescription>
                {activeTab === 'pending' && 'Các công ty đang chờ phê duyệt'}
                {activeTab === 'approved' && 'Các công ty đã được phê duyệt'}
                {activeTab === 'rejected' && 'Các công ty đã bị từ chối'}
                {activeTab === 'all' && 'Tất cả các công ty trong hệ thống'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm kiếm công ty..."
                  />
                </div>
                <CompanyFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>

              {/* Table */}
              <DataTable
                columns={columns}
                data={companies}
                loading={loading}
                emptyMessage={
                  activeTab === 'pending'
                    ? 'Không có công ty nào đang chờ duyệt'
                    : 'Không tìm thấy công ty nào'
                }
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <CompanyDetailModal
        company={selectedCompany}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}

