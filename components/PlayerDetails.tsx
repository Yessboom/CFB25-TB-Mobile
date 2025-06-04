import React, { useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { updatePlayerBasicInfo } from '../services/playerApi';
import { getOverall } from '../utils/overallCalculator';
import { formatHeight, formatWeight, getPositionName } from '../utils/utils';
import EditableInput from './EditableInput';
import ImpactPlayerToggle from './PlayerImpact';
import PlayerSkillTabs from './PlayerSkillTabs';
import SliderInput from './SliderInput';


import { Player } from "@/types/FullTypes";

interface PlayerDetailsProps {
  player: Player | null;
}

export default function PlayerDetails({ player }: PlayerDetailsProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const activeTab = useMemo(() => {
    return searchParams.get('tab') ?? 'physical';
  }, [searchParams]);

  // Debug: Log when player changes
  useEffect(() => {
    console.log('PlayerDetails received player:', player);
  }, [player]);

  const getSkillValue = (player: any, skillName: string): number | null => {
    return player[skillName] !== undefined && player[skillName] !== null ? player[skillName] : null;
  };

  const formatSkillName = (skillName: string): string => {
    // Convert camelCase to readable format
    return skillName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Calculate overall rating
  const overall = useMemo(() => {
    return player ? getOverall(player) : 0;
  }, [player]);

  if (!player) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <p className="p-4 text-gray-500">Select a player to view details</p>
      </div>
    );
  }

  console.log('Rendering selected player:', player);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Player Header */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex items-start space-x-4">
          {/* Player Portrait */}
          <div className="flex-shrink-0">
            {player.portraitImage ? (
              <img 
                src={player.portraitImage} 
                alt={`${player.firstName} ${player.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                loading="lazy"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900 space-x-2">
                <EditableInput
                  value={player.firstName}
                  playerId={player.id}
                  field="firstName"
                  type="text"
                  updateAction={updatePlayerBasicInfo}
                  displayClass="font-medium"
                />
                <EditableInput
                  value={player.lastName}
                  playerId={player.id}
                  field="lastName"
                  type="text"
                  updateAction={updatePlayerBasicInfo}
                  displayClass="font-medium"
                />
              </h3>
              {/* Impact Player Star */}
              <ImpactPlayerToggle 
                playerId={player.id}
                isImpactPlayer={player.isImpactPlayer || false}
              />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              #<EditableInput
                value={player.jerseyNumber}
                playerId={player.id}
                field="jerseyNumber"
                type="number"
                min={1}
                max={99}
                updateAction={updatePlayerBasicInfo}
                displayClass="inline"
              /> • {getPositionName(player.position)}
              {player.isImpactPlayer && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Impact Player
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Overall Rating</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                overall >= 85 ? "bg-green-100 text-green-800" :
                overall >= 75 ? "bg-blue-100 text-blue-800" :
                overall >= 65 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {overall}
              </span>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <EditableInput
                value={player.age}
                playerId={player.id}
                field="age"
                type="number"
                min={18}
                max={45}
                updateAction={updatePlayerBasicInfo}
              />
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Position</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {getPositionName(player.position)}
            </dd>
          </div>
          
          {/* Height Slider */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Height</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <SliderInput
                value={player.height}
                playerId={player.id}
                field="height"
                min={60}
                max={84}
                formatter={(value) => formatHeight(value)}
                label="Height"
              />
            </dd>
          </div>
          
          {/* Weight Slider */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Weight</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <SliderInput
                value={player.weightPounds}
                playerId={player.id}
                field="weightPounds"
                min={150}
                max={400}
                step={5}
                formatter={(value) => formatWeight(value)}
                label="Weight"
              />
            </dd>
          </div>
          
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Potential</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                player.potential >= 85 ? "bg-green-100 text-green-800" :
                player.potential >= 75 ? "bg-blue-100 text-blue-800" :
                player.potential >= 65 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {player.potential}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200">
        <PlayerSkillTabs player={player} />
      </div>

      {/* Contract Info */}
      {player.contractYearsLeft > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
          <h4 className="text-base font-medium text-gray-900 mb-3">Contract Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block font-medium text-gray-700">Years Left</span>
              <span className="text-gray-900">{player.contractYearsLeft}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-700">Total Salary</span>
              <span className="text-gray-900">${player.validTotalSalary?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Loadouts Section */}
      {player.loadouts && player.loadouts.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Equipment</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 bg-white">
              {player.loadouts.map((loadout, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 truncate">
                      {loadout.loadoutType === 0 ? "Head" : 
                      loadout.loadoutType === 1 ? "Upper Body" : 
                      loadout.loadoutType === 2 ? "Lower Body" : 
                      "Accessories"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </div>
  );
}