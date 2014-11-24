/* ========================================================================
 * Copyright 2014 miso4204
 *
 * Licensed under the MIT, The MIT License (MIT)
 * Copyright (c) 2014 miso4204

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 * ========================================================================


Source generated by CrudMaker version 1.0.0.qualifier

*/

package co.edu.uniandes.csw.miso4204.reward.persistence;

import co.edu.uniandes.csw.miso4204.reward.logic.dto.RewardDTO;
import co.edu.uniandes.csw.miso4204.reward.logic.dto.RewardPageDTO;
import co.edu.uniandes.csw.miso4204.reward.persistence.converter.RewardConverter;
import co.edu.uniandes.csw.miso4204.reward.persistence.entity.RewardEntity;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.persistence.NoResultException;
import org.apache.shiro.SecurityUtils;
public class RewardPersistence extends _RewardPersistence{
    
    protected EntityManagerFactory emf;

	public RewardPersistence(){
		emf = Persistence.createEntityManagerFactory("RewardPU");
		//entityManager = emf.createEntityManager();
	}
        
        public void getEntityManager() {
        co.edu.uniandes.csw.miso4204.security.logic.dto.UserDTO userS = (co.edu.uniandes.csw.miso4204.security.logic.dto.UserDTO) SecurityUtils.getSubject().getPrincipal();
        String tenant = userS.getTenantID();
        Map<String, Object> emProperties = new HashMap<String, Object>();
        emProperties.put("eclipselink.tenant-id", tenant);//Asigna un valor al multitenant
        entityManager = emf.createEntityManager(emProperties);
        }
	
	@Override
	public RewardDTO createReward(RewardDTO reward) {            
            getEntityManager();
		if(reward.getValue() != null) {
			reward.setPoints(Integer.valueOf(reward.getValue().intValue()/1000));
		}
		entityManager.getTransaction().begin();
		Integer accumulatedPoints;
		try {
			Query query = entityManager.createQuery("SELECT u.totalPoints FROM RewardEntity u WHERE u.buyerId = "+reward.getBuyerId()+" ORDER BY u.date DESC").setMaxResults(1);
			accumulatedPoints = Integer.parseInt(query.getSingleResult().toString());
			reward.setTotalPoints(accumulatedPoints+reward.getPoints());
		} catch(NoResultException e) {
			accumulatedPoints = 0;
    }
		RewardEntity entity=RewardConverter.persistenceDTO2Entity(reward);
                
            try {
		entityManager.persist(entity);
		entityManager.getTransaction().commit();
            }
            catch(Exception e){
             e.printStackTrace();

            }finally{
                if (entityManager.isOpen()) {
                    entityManager.close();
                }
            }
		return RewardConverter.entity2PersistenceDTO(entity);
                
	}
	
	@SuppressWarnings("unchecked")
	public RewardDTO getAccumulatedPoints(Long id) {
            
            getEntityManager();
            
            entityManager.getTransaction().begin();
            Query query = entityManager.createQuery("SELECT u FROM RewardEntity u WHERE u.buyerId = "+id+" ORDER BY u.date DESC").setMaxResults(1);
            RewardDTO result = RewardConverter.entity2PersistenceDTO((RewardEntity)query.getSingleResult());
            
            try {
                entityManager.getTransaction().commit();		
            }            
            catch(Exception e){
             e.printStackTrace();

            }finally {
                if (entityManager.isOpen()) {
                    entityManager.close();
                }
            }
            
            return result;
	}
        
        
        @SuppressWarnings("unchecked")
	public RewardPageDTO getRewardsDate(String minDate, String maxDate,Integer page, Integer maxRecords) {
            
            minDate= minDate.equals("") ? "0000/00/00" : minDate;
            maxDate= maxDate.equals("") ? "3333/33/33" : maxDate;
            RewardPageDTO response = new RewardPageDTO();
            try{
                getEntityManager();
		entityManager.getTransaction().begin();
		Query count = entityManager.createQuery("SELECT COUNT(u) FROM RewardEntity u WHERE u.date > '"+minDate+"' AND u.date < '"+maxDate+"'");
		Long regCount = 0L;
		regCount = Long.parseLong(count.getSingleResult().toString());
		
		Query q = entityManager.createQuery("SELECT u FROM RewardEntity u WHERE u.date > '"+ minDate +"' AND u.date < '"+ maxDate +"'");
		if (page != null && maxRecords != null) {
		    q.setFirstResult((page-1)*maxRecords);
		    q.setMaxResults(maxRecords);
		}
		response.setTotalRecords(regCount);
		response.setRecords(RewardConverter.entity2PersistenceDTOList(q.getResultList()));
            }catch(Exception e){
                e.printStackTrace();
            }
            finally{
                entityManager.getTransaction().commit();
                
                if (entityManager.isOpen()) {
                    entityManager.close();
                }
                
            }    
            return response;    
		
	}
        
    @Override
    public List<RewardDTO> getRewards() {
        List<RewardDTO> listRewards;
        
        try {
            getEntityManager();
            listRewards = super.getRewards();            
        }catch (Exception e) {
            e.printStackTrace();
            listRewards = null;            
        }finally {
            if (entityManager.isOpen()) 
                entityManager.close();            
        }
        
        return listRewards;
    }
    
    @Override
    public RewardPageDTO getRewards(Integer page, Integer maxRecords) {
        
    RewardPageDTO rewardPage2;
    
     try {
            getEntityManager();
            rewardPage2 = super.getRewards(page, maxRecords);
        } catch (Exception e) {
            e.printStackTrace();
            rewardPage2 = null;
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
     
     return rewardPage2;
    }
    
    @Override
    public RewardDTO getReward(Long id) {
        RewardDTO reward2;
        
        try {
            getEntityManager();
            reward2 = super.getReward(id);
        } catch (Exception e) {
            e.printStackTrace();
            reward2 = null;
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
        
        return reward2;
    }
     
    @Override
    public void deleteReward(Long id) {
        
        try {
            getEntityManager();
            super.deleteReward(id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }       
    }
    
    @Override
    public void updateReward(RewardDTO detail) {
        
        try {
           getEntityManager();
           super.updateReward(detail);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }        
    }
        
}