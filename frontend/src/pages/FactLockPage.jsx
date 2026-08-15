import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { factLockApi } from '../api/factLockApi';
import { useToast } from '../context/ToastContext';
import VerificationMeter from '../components/factlock/VerificationMeter';
import ClaimCard from '../components/factlock/ClaimCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  ShieldCheck, 
  Layers, 
  Filter, 
  Sparkles, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

const FactLockPage = () => {
  const { id } = useParams();
  const { error, success, info } = useToast();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNVERIFIED' | 'VERIFIED' | 'USER_CONFIRMED' | 'REJECTED'

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const data = await factLockApi.getClaims(id);
      setOverview(data);
    } catch (err) {
      console.error('Failed to load claims:', err);
      error(err.response?.data?.message || 'Failed to load Fact Lock overview');
    } finally {
      setLoading(false);
    }
  }, [id, error]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleVerify = async (claimId) => {
    try {
      await factLockApi.verifyClaim(id, claimId);
      success('Claim confirmed and marked as verified!');
      fetchClaims();
    } catch (err) {
      console.error('Verify failed:', err);
      error(err.response?.data?.message || 'Failed to confirm claim');
    }
  };

  const handleReject = async (claimId) => {
    try {
      await factLockApi.rejectClaim(id, claimId);
      success('Claim rejected. It will be excluded from final PDF export.');
      fetchClaims();
    } catch (err) {
      console.error('Reject failed:', err);
      error(err.response?.data?.message || 'Failed to reject claim');
    }
  };

  const handleUpdate = async (claimId, claimData) => {
    try {
      await factLockApi.updateClaim(id, claimId, claimData);
      success('Claim updated successfully!');
      fetchClaims();
    } catch (err) {
      console.error('Update claim failed:', err);
      error(err.response?.data?.message || 'Failed to update claim');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading Fact Lock verification hub..." size="large" />
      </div>
    );
  }

  const allClaims = overview?.claims || [];
  const filteredClaims = allClaims.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  const unverifiedCount = allClaims.filter((c) => c.status === 'UNVERIFIED').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/resumes/${id}`} className="text-slate-400 hover:text-slate-200 p-1 -ml-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-brand-400" />
              Fact Lock Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Trace every bullet point back to your raw career input and resolve unverified claims before export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/resumes/${id}/facts`} className="btn-secondary !py-2 !px-3 !text-xs">
            <Layers className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Manage Source Grounding Facts
          </Link>
          <Link to={`/resumes/${id}`} className="btn-primary !py-2 !px-3 !text-xs">
            <FileText className="w-3.5 h-3.5 mr-1" />
            Back to Editor
          </Link>
        </div>
      </div>

      {/* Verification Score Meter */}
      <VerificationMeter overview={overview} />

      {/* Unverified Action Banner */}
      {unverifiedCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3 text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-300">Action Recommended: </span>
            You have <strong className="font-bold">{unverifiedCount} unverified claims</strong> that could not be automatically confirmed from your initial input. Please review and approve or reject them below.
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'ALL', label: 'All Claims', count: allClaims.length },
            { id: 'UNVERIFIED', label: 'Needs Review', count: unverifiedCount },
            { id: 'VERIFIED', label: 'Verified', count: overview?.verifiedCount || 0 },
            { id: 'USER_CONFIRMED', label: 'Confirmed', count: overview?.userConfirmedCount || 0 },
            { id: 'REJECTED', label: 'Rejected', count: overview?.rejectedCount || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-950/60">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredClaims.length} of {allClaims.length}
        </span>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filteredClaims.map((claim) => (
          <ClaimCard
            key={claim.id}
            claim={claim}
            onVerify={handleVerify}
            onReject={handleReject}
            onUpdate={handleUpdate}
          />
        ))}

        {filteredClaims.length === 0 && (
          <EmptyState
            icon={ShieldCheck}
            title={
              statusFilter === 'ALL'
                ? 'No Fact Lock claims generated yet'
                : `No ${statusFilter.toLowerCase()} claims found`
            }
            description={
              statusFilter === 'ALL'
                ? 'Generate your resume in the editor to populate grounded Fact Lock claims.'
                : 'All claims in this category are resolved.'
            }
            actionLabel={statusFilter === 'ALL' ? 'Go to Editor' : 'Show All Claims'}
            onAction={
              statusFilter === 'ALL'
                ? () => navigate(`/resumes/${id}`)
                : () => setStatusFilter('ALL')
            }
          />
        )}
      </div>
    </div>
  );
};

export default FactLockPage;
