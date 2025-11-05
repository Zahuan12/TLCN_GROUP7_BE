import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { formatRelativeTime } from '../../../utils/formatDate';
import {
  Building2Icon,
  FileTextIcon,
  CheckCircle2Icon,
  UserPlusIcon,
  AlertCircleIcon
} from 'lucide-react';

/**
 * ActivityTimeline - Show recent activities in the system
 * 
 * @param {Object} props
 * @param {Array} props.activities - Array of activity objects
 */
export default function ActivityTimeline({ activities = [] }) {
  const getActivityIcon = (type) => {
    const iconProps = { className: 'w-4 h-4' };
    
    switch (type) {
      case 'COMPANY_REGISTERED':
        return <Building2Icon {...iconProps} className="w-4 h-4 text-blue-500" />;
      case 'BLOG_PUBLISHED':
        return <FileTextIcon {...iconProps} className="w-4 h-4 text-green-500" />;
      case 'TEST_COMPLETED':
        return <CheckCircle2Icon {...iconProps} className="w-4 h-4 text-emerald-500" />;
      case 'USER_REGISTERED':
        return <UserPlusIcon {...iconProps} className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircleIcon {...iconProps} className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'COMPANY_REGISTERED':
        return 'bg-blue-100 border-blue-200';
      case 'BLOG_PUBLISHED':
        return 'bg-green-100 border-green-200';
      case 'TEST_COMPLETED':
        return 'bg-emerald-100 border-emerald-200';
      case 'USER_REGISTERED':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircleIcon className="w-12 h-12 mb-2 opacity-50" />
            <p>Chưa có hoạt động nào</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-0.5 h-full bg-border absolute top-10" />
                )}
              </div>

              {/* Activity content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.actor.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length > 5 && (
          <button className="w-full mt-4 text-sm text-primary hover:underline">
            Xem tất cả hoạt động
          </button>
        )}
      </CardContent>
    </Card>
  );
}

